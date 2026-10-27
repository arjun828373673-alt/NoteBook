document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notesArea");
  const saveBtn = document.getElementById("saveBtn");

chrome.storage.local.getElementById(["savedNotes"], (result) => {
    if (result.savedNotes) {
        notesArea.value = result.savedNotes;
    }
});

saveBtn.addEventListener("click", () => {
    const notesText = notesArea.value;
    chrome.storage.local.set({ savedNotes: notesText}, ()=> {
        alert("Notes saved successfully");
    });
});
});
