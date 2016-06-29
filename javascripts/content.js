var DEFAULT = {
    "select tab left": "command+shift+1",
    "select tab right": "command+shift+2",
    "move tab left": "command+shift+a",
    "move tab right": "command+shift+s",
    "move tab window": "command+shift+x"
};

var options = DEFAULT

function activateShortcuts(){
    // create keybindings
    for(var action in options){
        if(options.hasOwnProperty(action)){
            bindAction(action);
        }
    }

    // handler for when shortcut is entered while the user is in a
    // form field
    Mousetrap.prototype.stopCallback = function(event, element, combo){
        // returning false allows the shortcuts action to be executed
        return false;
    };
}

function bindAction(action){
    Mousetrap.bind(options[action], function(){
        chrome.runtime.sendMessage({action: action});
    });
}

chrome.runtime.onMessage.addListener(handleResponse);

function handleResponse(response, sender, sendResponse){
    if(response.action === "move tab window"){
        response.images.forEach(function(image) {
            var fragment = "<img class='screenshot_move' src=" + image + " width='400'>"
        });
    }    
}

activateShortcuts();
