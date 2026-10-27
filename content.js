console.log("Notebook extension loaded on YouTube");

function getVideoTitle() {
    const titleElement = document.querySelector("h1.ytd-watch-metadata") || document.querySelector("yt-formatted-string.style-scope.ytd-watch-metadata");
    if (titleElement) {
    return titleElement.innerText.trim();
}

return document.title.replace(" - YouTube", "").trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.action === "getvideoDetails") {
        const title = getVideoTitle();
        sendResponse({videoTitle: title, videoUrl: window.location.href});
    }
});