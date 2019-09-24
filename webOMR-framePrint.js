//  Helper: our EHR system uses HTML4 frames
//  inject a PRINT action button into Patient header frame
//  clicking it sets focus in that frame
//  _and_ allows the entire frameset to print all pages

let header = top.frames['header'];
if (header) {
    var form = header.document.getElementsByName('form')[0];
    if (form && form.innerHTML.length) {
        form.insertAdjacentHTML('beforebegin', `
    <div style="float:right;"><img id="printer" style="height:100%; margin:auto; object-fit:contain;" src="${chrome.runtime.getURL("assets/print-button.png")}" title="Print frame below" onclick="top.frames['main'].window.print();"></a></div>
    `);
        form.setAttribute('style', 'overflow:hidden;');
    }
}
