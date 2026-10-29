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

      if (!notesArea.value) {
        notesArea.value = "Generating your notes...";
      }
      chrome.tabs.sendMessage(activeTab.id, { action: "getvideoDetails"}, async (response)=> {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        notesArea.value = "Error unable to connect to youtube page.";
        return;
      }  
      if (response) {
          try {
         const summary = await summarizeWithSarvam(response.videoTitle, response.transcriptText);
          notesArea.value = `Video: ${response.videoTitle}\nURL: ${response.videoUrl}\n\nTranscript:\n${response.transcriptText}\n\nNotes:\n`;
        } catch (error) {
          console.error(error);
          notesArea.value = `Video: ${response.videoTitle}\nURL: ${response.videoUrl}\n\nTranscript:\n${response.transcriptText}\n\n(AI Summarization failed, showing raw transcript)`;
        }
      }
      })
    }
  });

  saveBtn.addEventListener("click", () => {
    const notesText = notesArea.value;
    chrome.storage.local.set({ savedNotes: notesText }, () => {
      alert("Notes saved successfully");
    });
  });
});

async function summerizeWithSarvam(Title, transcript) {
  const SARVAM_API_KEY = "sk_hrq0e29j_qEeQjRzgVzzEJHu7mf23kRcG";

  const prompt = `You are an export study assistant. Summarize the following YouTube video Transection into clean, concise bullet points covering bullet points covering all the key topics and main takeways. Avoid raw Text clutter. \n\nVideo Title: ${Title}\n\nTranscript:\n${transcript}`;
  try {
    const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": sk_hrq0e29j_qEeQjRzgVzzEJHu7mf23kRcG
    },
    body: JSON.stringify({
      modal: "sarvam-m",
      message: [
        {role: "system", content: "you are a helpful study notes generation."},
        {role: "user", content: prompt}
      ],
      temperature: 0.3
    })
    });

    const data = await res.json();
    if (data && data.choices && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      return "Failed to generate summary from API response.";
    }
  }catch (err) {
    console.error("sarvam API error:", err);
  }
}
