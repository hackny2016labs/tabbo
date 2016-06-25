var ACTION_HANDLERS = {
    "select tab left": selectTabLeft
};

chrome.runtime.onMessage.addListener(handleResponse);

function selectTabLeft(){
    chrome.tabs.getSelected(function(tab) {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            var prevTab = (tab.index == 0) ? tabs[tabs.length - 1] : tabs[tab.index - 1];
            chrome.tabs.update(prevTab.id, {active: true}, function() {
                console.log("done!");
            });
        });
    });
}

function handleResponse(response, sender, sendResponse){
    ACTION_HANDLERS[response.action]();
}

(function(){
    $('.test_1').on('click',function() {
        chrome.tabs.getSelected(function(tab) {
            chrome.tabs.move(tab.id, {windowId: window.id, index: tab.index + 1}, function(){
                console.log("done!");
            });
        });
    });
    $('.test_2').on('click',function() {
        chrome.windows.getAll({populate:true},function(windows){
            windows.forEach(function(window){
                chrome.tabs.captureVisibleTab(window.id, {quality: 50}, function (image) {
                    $( "#screenshot_start" ).append(function() {
                        return $("<img class='screenshot_move' src=" + image + " width='400'>").on('click', function() {
                            moveHandler(window.id);
                        });
                    });
                });
            });
        });
    });
    $('.test_3').on('click',function() {
        chrome.tabs.getSelected(function(tab) {
            chrome.tabs.query({currentWindow: true}, function(tabs) {
                var nextTab = tabs[tab.index + 1];
                chrome.tabs.update(nextTab.id, {active: true}, function() {
                    console.log("done!");
                });
            });
        });
    });
})();


function moveHandler(window_id) {
    chrome.tabs.getSelected(function(tab) {
        chrome.tabs.move(tab.id, {windowId: window_id, index: -1}, function(){
            console.log("done!");
        });
    });
}

