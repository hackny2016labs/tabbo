var toSendId = window.location.hash.slice(1);
chrome.windows.getAll({populate:true},function(windows){
    chrome.windows.getCurrent(function(currentWindow) {
        var count = 1;

        windows.forEach(function(eachWindow) {
            if (windows.length === 1) {
                $("#open-windows").append("<h1>No other open windows.</h1>")
            } else if(eachWindow.id !== currentWindow.id) {
                chrome.tabs.captureVisibleTab(eachWindow.id, {quality: 50}, function (image) {
                    Mousetrap.bind(count.toString(), function () {
                        selectWindow(eachWindow, toSendId)
                    });
                    $("#open-windows").append(function() {
                        var element;
                        eachWindow.tabs.forEach(function(tab) {
                            if (tab.active) {
                                element = $(
                                    "<div class='screenshot' style='background-image:url(" + image + ")''>" +
                                        "<div class='title-bar'>" +
                                            "<img src='" + tab.favIconUrl + "'/>" +
                                            "<div class='screen-title'>" + tab.title + "</div>" +
                                        "</div>" +
                                        "<div class='screen-index'>" + count + "</div>" +
                                    "</div>"
                                );
                                count++;
                            }
                        })
                        element.on('click', function() {
                            selectWindow(eachWindow, toSendId);
                        });
                        return element;
                    });
                });
            }
        });
        var currentTab;
        chrome.tabs.get(parseInt(toSendId), function(tab){
            $("#current-tab").html(function() {
                console.log('tab',tab);
                currentTab = $("<div class='title-bar'>" +
                        "<img src='" + tab.favIconUrl + "'/>" +
                        "<div class='screen-title'>" + tab.title + "</div>" +
                    "</div>");
                return currentTab ;
            })
        })
    });
});

function selectWindow(eachWindow, toSendId) {
    chrome.tabs.getSelected(function(tab){
        chrome.tabs.remove(tab.id);
    });
    sendTab(eachWindow.id, parseInt(toSendId));
}

function sendTab(windowId, tabId) {
    chrome.tabs.move(tabId, {windowId: windowId, index: -1})
}

var port = chrome.extension.connect({name: "tabbo in we go!"});

$("#keybinds").click(function() {
    port.postMessage("keybinds");
})

