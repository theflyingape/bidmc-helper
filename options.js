function edmenu() {
    chrome.tabs.create({ url: 'https://edmenu.bidmc.harvard.edu/' });
}

document.getElementById('edmenu').addEventListener('click', edmenu);
