chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveImageAsPng",
    title: "Save Image as PNG",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "saveImageAsJpg",
    title: "Save Image as JPG",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === "saveImageAsPng" ||
    info.menuItemId === "saveImageAsJpg"
  ) {
    const format = info.menuItemId === "saveImageAsPng" ? "png" : "jpg";

    chrome.tabs.sendMessage(
      tab!.id!,
      { srcUrl: info.srcUrl, format },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Could not send message to content script:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("Message sent to content script successfully!");
        }
      }
    );
  }
});
