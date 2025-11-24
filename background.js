browser.runtime.onMessage.addListener((msg) => {
    if (msg.action === "download") {
        const url = URL.createObjectURL(msg.blob);

        browser.downloads.download({
            url,
            filename: msg.filename,
            saveAs: false
        });
    }
});
