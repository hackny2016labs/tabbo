(function(){
    $('.test_1').on('click',function() {
        chrome.sessions.getRecentlyClosed(function(sessions) {
            console.log(sessions);
        });
    });
    $('.test_2').on('click',function() {
        chrome.windows.getAll({populate:true},function(windows){
            windows.forEach(function(window){
                chrome.tabs.captureVisibleTab(window.id, {quality: 50}, function (image) {
                    $( "#screenshot_start" ).append("<img src=" + image + " width='400'>");
                });
            });
        });
    });
})();

(function(){
        console.log('now');
        Mousetrap.bind('4', function(){
            alert("Sup Dawg");
        });     
})();
