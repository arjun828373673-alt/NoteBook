document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("apiKey");
    const savebtn = document.getElementById("savebtn");
    const statusDiv = document.getElementById("status");

    chrome.storage.local.get(["sarvamApiKey"]), (result) => {
        if (result.sarvamApiKey) {
            
        }
    }
})