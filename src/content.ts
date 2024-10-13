console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.srcUrl && message.format) {
    const { srcUrl, format } = message;
    const imgElement = document.querySelector(`img[src="${srcUrl}"]`);
    const altText = imgElement ? imgElement.getAttribute("alt") : null;
    const pageTitle = document.title;

    const filename = generateFilename(altText, pageTitle, format);
    convertAndDownloadImage(srcUrl, format, filename);
  }
});

function convertAndDownloadImage(
  srcUrl: string,
  format: string,
  filename: string
) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = srcUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const mimeType = format === "png" ? "image/png" : "image/jpeg";

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("Blob creation failed.");
      }
    }, mimeType);
  };

  img.onerror = () => {
    console.error("Failed to load image for conversion.");
  };
}

function generateFilename(
  altText: string | null,
  pageTitle: string,
  format: string
): string {
  let baseName = altText ? altText : pageTitle;
  baseName = baseName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_").trim();
  if (!baseName) {
    baseName = "image";
  }
  return `${baseName}.${format}`;
}
