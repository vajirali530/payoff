chrome.runtime.onMessage.addListener((msg, sender, response) => {
    setTimeout(function() {
        response({status: true});
    }, 1);
    return true;
})
chrome.tabs.onUpdated.addListener(function(tabId, tab) {
    return true;
})

