/************************************************\
 *  BIDMC managed Chrome OS - Helper extension  *
\************************************************/

let badge = false;
chrome.browserAction.setBadgeText({text: ''});
const urls = [ 'atriushealth.org' ];
const UserAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';

//  Helper: User-Agent masking tape for older EHRs and Patient portals
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
console.log(badge);
        if (badge) {
            chrome.browserAction.setBadgeText({text: ''});
            badge = false;
        }
        if (/^(http|https):\/\/?.*/i.test(details.url)) {
            var hostname = (new URL(details.url)).hostname;
            for (var url in urls) {
                if (hostname.endsWith(urls[url])) {
                    for (var i = 0; i < details.requestHeaders.length; ++i) {
                        if (details.requestHeaders[i].name === 'User-Agent') {
                            //details.requestHeaders.splice(i, 1);
                            details.requestHeaders[i].value = UserAgent;
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
