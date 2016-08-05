var toSendId = window.location.hash.slice(1);
chrome.windows.getAll({populate:true},function(windows){
    chrome.windows.getCurrent(function(currentWindow) {
        var count = 1;
        windows.forEach(function(eachWindow) {
            if(eachWindow.id !== currentWindow.id) {
                chrome.tabs.captureVisibleTab(eachWindow.id, {quality: 50}, function (image) {
                    Mousetrap.bind(count.toString(), function () {
                        selectWindow(eachWindow, toSendId)
                    });
                    $("#open-windows").append(function() {
                        console.log('count',count);
                        var element = $(
                            "<div class='screenshot' style='background-image:url(" + image + ")''>" +
                                "<div class='screen-index'>" + count + "</div>" +
                            "</div>");
                        count++;
                        element.on('click', function() {
                            selectWindow(eachWindow, toSendId);
                        });
                        return element;
                    });
                });
            }
        });
    });
});

function selectWindow(eachWindow, toSendId) {
    chrome.tabs.getSelected(function(tab){
        chrome.tabs.remove(tab.id);
    });
    sendTab(eachWindow.id, parseInt(toSendId));
}

function sendTab(windowId, tabId) {
    chrome.tabs.move(tabId, {windowId: windowId, index: -1}, function() {
        console.log("moved!");
    })
}

$("#keybinds").click(function() {
    port.postMessage("keybinds");
})

var port = chrome.extension.connect({name: "Sample Communication"});
// port.onMessage.addListener(function(msg) {

// (function(){
//     $('.test_1').on('click',function() {
//         chrome.tabs.getSelected(function(tab) {
//             chrome.tabs.move(tab.id, {windowId: window.id, index: tab.index + 1}, function(){
//                 console.log("done!");
//             });
//         });
//     });
//     $('.test_2').on('click',function() {
//         chrome.windows.getAll({populate:true},function(windows){
//             windows.forEach(function(window){
//                 chrome.tabs.captureVisibleTab(window.id, {quality: 50}, function (image) {
//                     $( "#open-windows" ).append(function() {
//                         return $("<img class='screenshot_move' src=" + image + " width='400'>").on('click', function() {
//                             moveHandler(window.id);
//                         });
//                     });
//                 });
//             });
//         });
//     });
//     $('.test_3').on('click',function() {
//         chrome.tabs.getSelected(function(tab) {
//             chrome.tabs.query({currentWindow: true}, function(tabs) {
//                 var nextTab = tabs[tab.index + 1];
//                 chrome.tabs.update(nextTab.id, {active: true}, function() {
//                     console.log("done!");
//                 });
//             });
//         });
//     });
//     $('.test_4').on('click', function() {
//         popOffWindow();
//     })
// })();


// function popOffWindow() {
//     chrome.tabs.getSelected(function(tab){
//         chrome.windows.create({tabId: tab.id}, function() {
//             console.log('popped off!');
//         });
//     })
// }

// function moveHandler(window_id) {
//     chrome.tabs.getSelected(function(tab) {
//         chrome.tabs.move(tab.id, {windowId: window_id, index: -1}, function(){
//             console.log("done!");
//         });
//     });
// }
