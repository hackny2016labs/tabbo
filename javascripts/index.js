const utils = window.utils;
const toSendId = window.location.hash.slice(1);

Promise.all([
	utils.getAllWindows({populate: true}),
	utils.getCurrentWindow()
]).then((resolution) => {
	const windows = resolution[0];
	const current = resolution[1];
	let count = 1;

	const openWindows = $('#open-windows');

	if (windows.length === 1) {
		openWindows.append('<h1>No other open windows.</h1>');
	}

	windows.forEach((w) => {
		if (w.id === current.id) {
			return;
		}

		utils.screenshotTab(w.id, {quality: 50}).then((img) => {
			Mousetrap.bind(count.toString(), () => {
				selectWindow(w, toSendId);
			});

			openWindows.append(() => {
				let element;

				w.tabs.forEach((tab) => {
					if (tab.active) {
						element = $(
							`<div class="screenshot" style="background-image: url(${img})">`+
							`<div class="title-bar"> <img src="${tab.favIconUrl}"/>` +
							`<div class="screen-title">${tab.title}</div></div>` +
							`<div class="screen-index">${count}</div>` +
							`<div class="tab-count">${w.tabs.length + (w.tabs.length === 1 ? " tab" : " tabs")}` +
							`</div></div>`
						);
						count++;
					}
				});

				element.on('click', () => {
					selectWindow(w, toSendId);
				});

				return element;
			});
		});
	});

	utils.getTab(toSendId).then((tab) => {
		document.title = 'SENDING TAB';
		let sendingTitle = false;
		setInterval(() => {
			if (sendingTitle) {
				document.title = 'SENDING TAB';
			} else {
				document.title = `${tab.title}`
			}
			sendingTitle = !sendingTitle;
		}, 1250);

		$('#current-tab').html(() => $(
			`<div class="title-bar"><img src="${tab.favIconUrl}"/>` +
			`<div class="screen-title">${tab.title}</div></div>`
		));
	});
});

Mousetrap.bind('escape', () => {
	utils.getSelectedTab().then((tab) => {
		chrome.tabs.remove(tab.id);
	});
});

document.querySelector('#cancel').addEventListener('click', () => {
	utils.getSelectedTab().then((tab) => {
		chrome.tabs.remove(tab.id);
	});
});

function selectWindow(eachWindow, toSendId) {
	utils.getSelectedTab().then((tab) => {
		chrome.tabs.remove(tab.id);
	});

	sendTab(eachWindow.id, parseInt(toSendId));
}

function sendTab(windowId, tabId) {
	chrome.tabs.move(tabId, {windowId: windowId, index: -1});
	chrome.windows.update(windowId, {focused: true});
	chrome.tabs.update(tabId, {selected: true});
}

const port = chrome.runtime.connect({name: 'tabbo in we go!'});

document.querySelector('#keybinds').addEventListener('click', () => {
	port.postMessage('keybinds');
});
