var port = chrome.extension.connect({name: "popup"});

$("#keybinds").click(function() {
    port.postMessage("keybinds");
})

$("#instructions").click(function() {
    port.postMessage("instructions");
})

