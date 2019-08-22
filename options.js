/*
function edmenu() {
    chrome.tabs.create({ url: 'https://edmenu.bidmc.harvard.edu/' });
}
document.getElementById('edmenu').addEventListener('click', edmenu);
*/

let app = chrome.runtime.getManifest();
document.getElementById('banner').innerText = `version ${app.version}`;

const url = chrome.runtime.getURL("./assets/config.json");
fetch(url).then((response) => response.json().then((config) => {
    chrome.storage.managed.get(function(policy) {
        let buttons = document.getElementById('buttons');
        for (i in policy.buttons) {
            buttons.innerHTML += `<p><button id='button${i}'>${policy.buttons[i].caption}</button></p>`;
        }

        let features = document.getElementById('features');
        features.innerHTML = '<h5>Features</h5><ul>';
        for (i in config.features) {
            if (policy[i]) features.innerHTML += `<li>${i}: ${config.features[i].text}</li>`;
        }
        features.innerHTML += '</ul>';
    });
}));
