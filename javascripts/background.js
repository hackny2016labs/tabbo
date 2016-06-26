var ACTION_HANDLERS = {
    "select tab left": selectTab,
    "select tab right": selectTab,
    "move tab left": moveTab,
    "move tab right": moveTab
};

var INDEX_HANDLERS = {
    "select tab left": prevTab,
    "select tab right": nextTab,
    "move tab left": prevTab,
    "move tab right": nextTab
};

chrome.runtime.onMessage.addListener(handleResponse);

function selectTab(action){
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        chrome.tabs.getSelected(function(tab) {
            var nextTab = INDEX_HANDLERS[action](tab, tabs)
            chrome.tabs.update(nextTab.id, {active: true}, function() {
                console.log("done!");
            });
        });
    });
}

function moveTab(action) {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        chrome.tabs.getSelected(function(tab) {
            var nextTab = INDEX_HANDLERS[action](tab, tabs)
            chrome.tabs.move(tab.id, {index: nextTab.index}, function(){
                console.log("done!");
            });
        });
    });
}

function handleResponse(response, sender, sendResponse){
    ACTION_HANDLERS[response.action](response.action);
}

function prevTab(tab, tabs) {
    return tab.index == 0 ? tabs[tabs.length - 1] : tabs[tab.index - 1];
}

function nextTab(tab, tabs) {
    return tab.index == tabs.length - 1 ? tabs[0] : tabs[tab.index + 1];
}

// (function(){
//     $('.test_2').on('click',function() {
//         chrome.windows.getAll({populate:true},function(windows){
//             windows.forEach(function(window){
//                 chrome.tabs.captureVisibleTab(window.id, {quality: 50}, function (image) {
//                     $( "#screenshot_start" ).append(function() {
//                         return $("<img class='screenshot_move' src=" + image + " width='400'>").on('click', function() {
//                             moveHandler(window.id);
//                         });
//                     });
//                 });
//             });
//         });
//     });
// })();


function moveHandler(window_id) {
    chrome.tabs.getSelected(function(tab) {
        chrome.tabs.move(tab.id, {windowId: window_id, index: -1}, function(){
            console.log("done!");
        });
    });
}

