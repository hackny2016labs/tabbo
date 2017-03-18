const port = chrome.extension.connect({name: 'popup'});

$('#keybinds').click(() => {
	port.postMessage('keybinds');
});

$('#instructions').click(() => {
	port.postMessage('instructions');
});

$('#pop').click(() => {
	port.postMessage('pop');
});

$('#send').click(() => {
	port.postMessage('send');
});

$('#join').click(() => {
	port.postMessage('join');
});

let bonusClicked = 0;
$('#bonus').click(() => {
	bonusClicked+=1;
	if (bonusClicked === 1) {
		$('#bonus').html('stop it');
	} else if (bonusClicked === 2) {
		$('#bonus').html('I\'m warning you');
	} else if (bonusClicked === 3) {
		$('#bonus').html('last warning...');
	}

	if (bonusClicked > 3) {
		$('#bonus').html('explode!!');
		port.postMessage('explode');
	}
});
