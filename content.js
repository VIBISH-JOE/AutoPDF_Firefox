// Inject script into page context
const script = document.createElement("script");
script.src = browser.runtime.getURL("inject.js");
(document.documentElement || document.head).appendChild(script);

// Listen for PDF blob messages
window.addEventListener("AutoPDFBlob", (e) => {
    browser.runtime.sendMessage({
        action: "download",
        filename: e.detail.filename,
        blob: e.detail.blob
    });
});
