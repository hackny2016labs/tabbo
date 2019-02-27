const port = chrome.extension.connect({name: 'popup'});

document.querySelector('#keybinds').addEventListener('click', () => {
	port.postMessage('keybinds');
});

document.querySelector('#instructions').addEventListener('click', () => {
	port.postMessage('instructions');
});

document.querySelector('#pop').addEventListener('click', () => {
	port.postMessage('pop');
});

document.querySelector('#send').addEventListener('click', () => {
	port.postMessage('send');
});

document.querySelector('#send').addEventListener('click', () => {
	port.postMessage('send');
});