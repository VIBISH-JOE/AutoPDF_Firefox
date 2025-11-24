(function () {
    let lastBlob = null;
    let lastFilename = null;

    const origFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = args[0];

        if (typeof url === "string" && url.includes(".pdf")) {
            console.log("📥 AutoPDF Firefox → Captured:", url);

            const response = await origFetch.apply(this, args);
            const clone = response.clone();
            const buf = await clone.arrayBuffer();
            const blob = new Blob([buf], { type: "application/pdf" });

            lastBlob = blob;
            lastFilename = url.split("/").pop().split("?")[0] || "file.pdf";

            window.dispatchEvent(
                new CustomEvent("AutoPDFBlob", {
                    detail: { filename: lastFilename, blob }
                })
            );

            return response;
        }

        return origFetch.apply(this, args);
    };

    // floating button
    function addButton() {
        if (document.getElementById("auto-pdf-download-btn")) return;

        const btn = document.createElement("button");
        btn.id = "auto-pdf-download-btn";
        btn.textContent = "Download PDF";

        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "999999",
            padding: "8px 12px",
            background: "#111",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
        });

        btn.onclick = () => {
            if (!lastBlob) {
                alert("No PDF captured yet");
                return;
            }

            const a = document.createElement("a");
            a.href = URL.createObjectURL(lastBlob);
            a.download = lastFilename;
            a.click();
        };

        document.body.appendChild(btn);
    }

    document.addEventListener("DOMContentLoaded", addButton);
})();