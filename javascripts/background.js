var directions = {
    LEFT: 0,
    RIGHT: 1
};

chrome.commands.onCommand.addListener(function(command) {
    switch(command) {
        case 'move_right':
            moveTab(directions.RIGHT);
            break;
        case 'move_left':
            moveTab(directions.LEFT);
            break;
        case 'pop_off':
            popOffWindow();
            break;
        case 'move_tab_window':
            moveTabWindow();
            break;
        default:
            break;
    }
});

function moveTab(direction) {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        chrome.tabs.getSelected(function(tab) {
            var newTab = (direction === directions.LEFT) ? prevTab(tab, tabs) : nextTab(tab, tabs);
            chrome.tabs.move(tab.id, {index: newTab.index});
        });
    });
}

function prevTab(tab, tabs) {
    return tab.index === 0 ? tabs[tabs.length - 1] : tabs[tab.index - 1];
}

function nextTab(tab, tabs) {
    return tab.index == tabs.length - 1 ? tabs[0] : tabs[tab.index + 1];
}

function popOffWindow() {
    chrome.tabs.getSelected(function(tab){
        chrome.windows.create({tabId: tab.id});
    });
}

function moveTabWindow() {

}
