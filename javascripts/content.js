var DEFAULT = {
    "select tab left": "command+shift+1",
    "select tab right": "command+shift+2",
    "move tab left": "command+shift+a",
    "move tab right": "command+shift+s",
};

var options = DEFAULT;

function activateShortcuts(){
    for(var action in options){
        if(options.hasOwnProperty(action)){
            bindAction(action);
        }
    }
}

function bindAction(action){
    Mousetrap.bind(options[action], function(){
        chrome.runtime.sendMessage({action: action}, handleResponse);
    });
}

function handleResponse(response) {
    if(response.action === "move tab window"){
        // inject images
        // tell background which window to send tab to 
    }     
}

activateShortcuts();
