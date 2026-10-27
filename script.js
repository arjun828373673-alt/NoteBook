document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["savedNotes"], (result) => {
        if (result.savedNotes) {
            document.getElementById("notesArea").value = result.savedNotes;
        }
    });
});

document.getElementById("savebtn").addEventListener("click", () => {
    const notesText = document.getElementById("notesArea").value;
    chrome.storage.local.set({ savedNotes: notesText }, () =>{
      alert("Notes saved Successfully");
    });
});
