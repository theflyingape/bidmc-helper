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

//  defunct trial code
/*
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
      tab.id,
      {code: 'window.print();'});
});
chrome.browserAction.setPopup({popup:"options.html"});
*/

/*
let config = {
    NewTab: '',
    UserAgent: [],
    webOMR: false
};
const url = chrome.runtime.getURL("./assets/config.json");
fetch(url).then((response) => response.json().then((json) => {
config = json;
console.log(config);
*/

/*
//  Helper: hide patient "header" frameset in window for when user wants to print
if (config.webOMR) {
console.log('webOMR on');
    chrome.tabs.executeScript({ code:`
        let header = document.getElementsByName('header');
        if (header) {
            window.onbeforeprint = function(event) {
                let header = document.getElementsByName('header');
                if (header) header.hidden = true;
            };
            window.onafterprint = function(event) {
                let header = document.getElementsByName('header');
                if (header) header.hidden = false;
            };
        }
    `});
}

// end of config loaded
}));
*/
