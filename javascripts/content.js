var DEFAULT = {
    "select tab left": "command+left",
    "select tab right": "command+right",
    "move tab left": "command+shift+left",
    "move tab right": "command+shift+right",
    "move tab window": "command+shift+w"
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
