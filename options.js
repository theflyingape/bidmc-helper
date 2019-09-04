//  Options: managed via Admin storage schema
const url = chrome.runtime.getURL("assets/config.json");
fetch(url).then((response) => response.json().then((config) => {
    chrome.storage.managed.get(function(policy) {
        console.log('JSON configuration options: ', JSON.stringify(policy));
        //  enumerate any managed buttons first
        if (policy.buttons && policy.buttons.length) {
            let buttons = document.getElementById('buttons');
            for (i in policy.buttons) {
                buttons.innerHTML +=
                    `<p><button id="button${i}">${policy.buttons[i].caption}</button></p>`;
            }
        //  soft-create: chrome.tabs.create({ url: 'https://edmenu.bidmc.harvard.edu/' });
            for (i in policy.buttons) {
                document.getElementById(`button${i}`)
                    .addEventListener('click', `window.open('${policy.buttons[i].url}', '_blank');`);
            }
        }

        //  compare config's built-in features with the loaded extension policy
        let app = chrome.runtime.getManifest();
        let features = document.getElementById('features');
        features.innerHTML = `<h2 style="color: darkslateblue;">v${app.version} enabled features</h2><ul>`;
        for (i in config.features) {
            if (policy[i]) features.innerHTML += `<li>${i}: ${config.features[i].text}</li>`;
        }
        features.innerHTML += '</ul>';
    });
}));
