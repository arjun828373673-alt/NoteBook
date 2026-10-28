console.log("Notebook extension loaded on YouTube");

function getVideoTitle() {
    const titleElement = document.querySelector("h1.ytd-watch-metadata") || document.querySelector("yt-formatted-string.style-scope.ytd-watch-metadata");
    if (titleElement) {
    return titleElement.innerText.trim();
}

return document.title.replace(" - YouTube", "").trim();
}

async function getAutoTranscript() {
    try{
        const transcriptSegments = document.querySelectorAll("ytd-transcript-segment-renderer");
        if (transcriptSegments && transcriptSegments.length > 0) {
            let text = "";
            transcriptSegments.forEach(segment => {
                const textElement = segment.querySelector("#content");
                if (textElement) text += textElement.innerText.trim() + " "; 
            });
            if (text.trim().length > 0) return text.trim();
        }
        const scripts = document.querySelectorAll("script");
        let playerRespones = null;

        for (const script of scripts) {
            const content = script.textContent;
            if (content && content.includes("ytInitialPlayerResponse")) {
                const match = content.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
                if (match && match[1]) {
                    try{
                        playerRespones = JSON.parse(match[1]);
                        break;
                    } catch (e) {

                    }
                }
            }
        }

        const tracks = playerRespones?.captions?.playerCaptionsTrackListRenderer?.captionTracks;
        if (tracks && tracks.length > 0) {
            const trackUrl = tracks[0].baseUrl;
            const response = await fetch(trackUrl);
            const textData = await response.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parserFromString(textData, "text/xml");
            const textNodes = xmlDoc.getElementsByTagName("text");

            let fullTranscript = "";
            for (let i = 0; i < textNodes.length; i++) {
                fullTranscript += textNodes[i].textContent + " ";
            }

            if (fullTranscript.trim().length > 0){
                return decodeEntities(fullTranscript.trim());
            }
        }

        return "Automatic transcript extraction pending: Please ensure video has captions enable.";
    } catch (e) {
        return "Unable to extract transcript.";
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.action === "getvideoDetails") {
        const title = getVideoTitle();
        const transcript = getTranscriptText();
        sendResponse({
            videoTitle: title,
            videoUrl: window.location.href,
            transcriptText: transcript
        });
    }
});
    
});