console.log("Notebook extension loaded on YouTube");

function getVideoTitle() {
    const titleElement = document.querySelector("h1.ytd-watch-metadata yt-formatted-string") || document.querySelector("h1.title yt-formatted-string");
    return titleElement ? titleElement.innerText : document.title;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.action === "getvideoDetails") {
        const title = getVideoTitle();
        sendResponse({videoTitle: title, videoUrl: window.location.href});
    }
});