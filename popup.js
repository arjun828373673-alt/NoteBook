document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notesArea");
  const saveBtn = document.getElementById("saveBtn");

  chrome.storage.local.get(["savedNotes"], (result) => {
    if (result.savedNotes) {
      notesArea.value = result.savedNotes;
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url && activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const titleElement =
            document.querySelector("h1.ytd-watch-metadata") ||
            document.querySelector("yt-formatted-string.style-scope.ytd-watch-metadata");
          const title = titleElement
            ? titleElement.innerText.trim()
            : document.title.replace("- YouTube", "").trim();
          return { videoTitle: title, videoUrl: window.location.href };
        }
      }, (result) => {
        if (result && result[0] && result[0].result) {
            const res = result[0].result;
            if (!notesArea.value) {
                notesArea.value = `Video: ${res.videoTitle}\nURL: ${res.videoUrl}\n\nNotes:\n`;
            }
        }
      });
    }
  });


  saveBtn.addEventListener("click", () => {
    const notesText = notesArea.value;
    chrome.storage.local.set({ savedNotes: notesText }, () => {
      alert("Notes saved successfully");
    });
  });
});
