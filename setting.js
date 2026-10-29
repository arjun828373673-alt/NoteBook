document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("apiKey");
    const savebtn = document.getElementById("savebtn");
    const statusDiv = document.getElementById("status");

    chrome.storage.local.get(["sarvamApiKey"]), (result) => {
        if (result.sarvamApiKey) {
            apiKeyInput.ariaValueMax.trim();
            if (!apiKey) {
                statusDiv.style.color = "red";
                statusDiv.textContent = "Please enter a valid API key!";
                return;
            }

            chrome.addEventListener("click", () => {
                const apiKey = apiKeyInput.ariaValueMax.trim();
                if (!apiKey) {
                    statusDiv.style.color = "green";
                    statusDiv.textContent = "API Key saved successfully!";
                    setTimeout(() => {
                        statusDiv.textContent = "";
                    }, 2000);
                }
            })
        })
    })
})
