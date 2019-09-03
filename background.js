/************************************************\
 *  BIDMC managed Chrome OS - Helper extension  *
\************************************************/

let badge = false;

chrome.storage.managed.get(function(policy) {

console.log('JSON configuration background: ', JSON.stringify(policy));

//  Helper: new tab page override
if (policy.newtab && policy.newtab.length) {
    console.log('feature newtab: ', policy.newtab);
    chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.url === 'chrome://newtab/') {
      chrome.tabs.update(tab.id, {url:policy.newtab});
    }
  });
}

//  Helper: User-Agent masking tape for older EHRs and Patient portals
if (policy.UserAgent && policy.UserAgent.length) {
    console.log('feature UserAgent: ', policy.UserAgent);
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (badge) {
                chrome.browserAction.setBadgeText({text: ''});
                badge = false;
            }
            if (/^(http|https):\/\/?.*/i.test(details.url)) {
                let hostname = (new URL(details.url)).hostname;
                for (let url in policy.UserAgent) {
                    if (hostname.endsWith(policy.UserAgent[url].domain)) {
                        for (let i = 0; i < details.requestHeaders.length; ++i) {
                            if (details.requestHeaders[i].name === 'User-Agent') {
                                //details.requestHeaders.splice(i, 1);
                                //details.requestHeaders[i].value = UserAgent;
                                details.requestHeaders[i].value = policy.UserAgent[url].value;
                                chrome.browserAction.setBadgeText({text: 'PC'});
                                badge = true;
                                break;
                            }
                        }
                    }
                }
            }
        return { requestHeaders: details.requestHeaders };
        },
            { urls: [ "<all_urls>" ] },
            [ "blocking", "requestHeaders" ]
    );
}

});
