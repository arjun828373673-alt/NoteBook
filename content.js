console.log("Notebook extension loaded on YouTube");

function getVideoTitle() {
    const titleElement = document.querySelector("h1.ytd-watch-metadata") || document.querySelector("yt-formatted-string.style-scope.ytd-watch-metadata");
    if (titleElement) {
    return titleElement.innerText.trim();
}

return document.title.replace(" - YouTube", "").trim();
}

function getTranscriptText() {
    const transcriptSegments = document.querySelectorAll("ytd-transcript-segment-renderer");
    if (transcriptSegments && transcriptSegments.length > 0) {
        let transcriptText = "";
        transcriptSegments.forEach(segment => {
            const textElement = segment.querySelector("#content");
           if (textElement) {
            transcriptText += textElement.innerText.trim() + " ";
           }
        });
        return transcriptText.trim();
    }
    return "Transcript not open or available. Please open the transcript panel on YouTube first. ";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.action === "getvideoDetails") {
        const title = getVideoTitle();
        const transcript = getTranscriptText();
        sendResponse({
            videoTitle: title,
            videoUrl: window.location.href,
            transcriptText: transcript
        })
    }
});