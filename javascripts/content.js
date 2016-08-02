var DEFAULT = {
    "select tab left": "command+shift+1",
    "select tab right": "command+shift+2",
    "move tab left": "command+shift+a",
    "move tab right": "command+shift+s",
    "move tab window request": "command+shift+x"
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
    if(response.action === "move tab window request"){
        var ele = document.createElement("div");
        ele.setAttribute("id", "screenshot");
        for(var i = 0; i < response.image.length; i++) {
            var screenshot = document.createElement('img');
            screenshot.src = response.image[i];
            screenshot.style.width = "400px";
            (function (screenshot, id) {
                screenshot.addEventListener('click', function(){
                    chrome.runtime.sendMessage({action: "move tab window", window_id: id});
                    ele.style.display = "none";
                });
            })(screenshot, response.id[i]);
            ele.appendChild(screenshot);
        }
        document.body.appendChild(ele);
        var screenshots = document.getElementById("screenshot"); 
        screenshots.style.position = "fixed";
        screenshots.style.top = "150px";
        screenshots.style.margin = "auto";

    }    
}

activateShortcuts();
