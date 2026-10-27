document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notesArea");
  const saveBtn = document.getElementById("saveBtn");

chrome.storage.local.get(["savedNotes"], (result) => {
    if (result.savedNotes) {
        notesArea.value = result.savedNotes;
    }
});

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url && activeTabUrl)

saveBtn.addEventListener("click", () =>{
    const notesText = Area.value;
    chrome.storage.local.set({ savedNotes: notesText}, ()=> {
        alert("Notes saved successfully");
    });
  });
});
