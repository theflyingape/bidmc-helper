const print = chrome.runtime.getURL("print-button.png");

function CtrlP() {
    console.log("Ctrl/P pressed");
    let main = top.frames['main'];
    if (main) {
        var sel = main.getSelection();
    /*  unneeded
        sel.removeAllRanges();
        var range = main.document.createRange();
        range.selectNode(main.document.body);
        sel.addRange(range);
    */
        main.window.print();
        sel.removeAllRanges();
    }
}

let header = top.frames['header'];
if (header) {
    var form = header.document.getElementsByName('form')[0];
    form.insertAdjacentHTML('beforebegin', `
<div style="float:right;"><img style="height:100%; margin:auto; object-fit:contain;" src="${print}" title="Print main frame below" onclick="top.frames['main'].window.print();"></a></div>
`);
    header.addEventListener("keydown", function (event) {
        let main = top.frames['main'];
        if (main && event.ctrlKey && event.keyCode == 80) {
            event.stopPropagation();
            event.preventDefault();
            CtrlP();
        }
    });

    let main = top.frames['main'];
    if (main) {
        main.addEventListener("unload", function (event) {
            console.log("main unloaded");
            let header = top.frames['header'];
            header.window.focus();
        });
    }
}

window.onbeforeprint = function(event) {
    let main = top.frames['main'];
    if (main) {
        let header = top.frames['header'];
        header.window.focus();
    /*  unneeded -- capture frame's content into another popup window for printing
        var sel = main.getSelection();
        sel.removeAllRanges();
        var range = main.document.createRange();
        range.selectNode(main.document.body);
        sel.addRange(range);

        var popup = window.open("",0,"toolbar,menubar,resizable,height=455,width=800,top=1,left=1");
        vat content = main.document.body.innerHTML;
        popup.document.body.innerHTML ='<HTML><HEAD></HEAD><BODY>' + content + '</BODY></HTML>';
        popup.print();
        popup.close();
*/
    }
};

window.onafterprint = function(event) {
    let main = top.frames['main'];
    if (main) {
        var sel = main.getSelection();
        sel.removeAllRanges();
    }
};
