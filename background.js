/************************************************\
 *  BIDMC managed Chrome OS - Helper extension  *
\************************************************/

let config = {
    NewTab: '',
    UserAgent: [],
    webOMR: false
};

const url = chrome.runtime.getURL("config.json");

fetch(url).then((response) => response.json().then((json) => {

config = json;
console.log(config);

//  Helper: User-Agent masking tape for older EHRs and Patient portals
if (config.UserAgent && config.UserAgent.length) {
    let badge = false;
    chrome.browserAction.setBadgeText({text: ''});

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (badge) {
                chrome.browserAction.setBadgeText({text: ''});
                badge = false;
            }
            if (/^(http|https):\/\/?.*/i.test(details.url)) {
                var hostname = (new URL(details.url)).hostname;
                for (var url in config.UserAgent) {
                    if (hostname.endsWith(config.UserAgent[url].domain)) {
                        for (var i = 0; i < details.requestHeaders.length; ++i) {
                            if (details.requestHeaders[i].name === 'User-Agent') {
                                //details.requestHeaders.splice(i, 1);
                                //details.requestHeaders[i].value = UserAgent;
                                details.requestHeaders[i].value = config.UserAgent[url].value;
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
*/

//  end of config loaded
}));
