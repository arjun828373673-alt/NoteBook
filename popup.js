document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notesArea");
  const saveBtn = document.getElementById("saveBtn");

chrome.storage.local.get(["savedNotes"], (result) => {
    if (result.savedNotes) {
        notesArea.value = result.savedNotes;
    }
});

chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url && activeTab.url.includes("youtube.com/watch")) {
        chrome.tabs.sendMessage(activeTab.id, {action: "getvideoDetails"}, (response) => {
            if (response && response.videoTitle) {
                if (!notesArea.value) {
                    notesArea.value = `Video: ${response.videoTitle}\nURL: ${response.videoUrl}\n\nNotes:\n`;
                }
            }
        });
    }
});

saveBtn.addEventListener("click", () => {
    const notesText = notesArea.value;
    chrome.storage.local.set({ savedNotes: notesText}, ()=> {
        alert("Notes saved successfully");
    });
  });
});
