const directions = {
	LEFT: 0,
	RIGHT: 1
};

chrome.commands.onCommand.addListener((command) => {
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
		case 'send_tab':
			sendTabManager();
		default:
			break;
	}
});

// listener to the client
chrome.extension.onConnect.addListener((port) => {
	port.onMessage.addListener((msg) => {
		switch(msg) {
			case "keybinds" :
				chrome.tabs.create({url : "chrome://extensions/configureCommands"});
				break;
			case "instructions" :
				chrome.tabs.create({url : "../instructions.html"});
				break;
			case "pop":
				popOffWindow();
				break;
			case "send":
				sendTabManager();
				break;
			case "explode":
				explodeTabs();
				break;
			case "join":
				joinTabs();
				break;
			default:
				break;
		}
	});
});

// Common functions wrapped in promises to avoid callback hell
const utils = {
	tabQuery: (options) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.query(options, (tabs) => {
				resolve(tabs);
			});
		});
	},
	getCurrentTab: () => {
		return new Promise((resolve, reject) => {
			chrome.tabs.getSelected((tab) => {
				resolve(tab);
			});
		});
	},
	getAllWindows: (options) => {
		return new Promise((resolve, reject) => {
			chrome.windows.getAll(options, (windows) => {
				resolve(windows);
			});
		});
	},
	getCurrentWindow: () => {
		return new Promise((resolve, reject) => {
			chrome.windows.getCurrent((currentWindow) => {
				resolve(currentWindow);
			});
		});
	},
	createTab: (options) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.create(options, (newTab) => {
				resolve(newTab);
			});
		});
	}
};

function moveTab(direction) {
	Promise.all([
		utils.tabQuery({currentWindow: true}),
		utils.getCurrentTab(),
	]).then((resolution) => {
		const tabs = resolution[0];
		const tab = resolution[1];
		const newTab = (direction === directions.LEFT) ? prevTab(tab, tabs) : nextTab(tab, tabs);

		chrome.tabs.move(tab.id, {index: newTab.index});
	});
}

function prevTab(tab, tabs) {
	return tab.index === 0 ? tabs[tabs.length - 1] : tabs[tab.index - 1];
}

function nextTab(tab, tabs) {
	return tab.index == tabs.length - 1 ? tabs[0] : tabs[tab.index + 1];
}

function popOffWindow() {
	utils.getCurrentTab().then((tab) => {
		chrome.windows.create({tabId: tab.id});
	});
}

function sendTabManager() {
	Promise.all([
		utils.getAllWindows({populate: true}),
		utils.getCurrentWindow()
	]).then((resolution) => {
		const windows = resolution[0];
		const currentWindow = resolution[1];

		if (windows.length === 1) {
			// do nothing
			return;
		} else if (windows.length === 2) {
			// send tab to only other window
			utils.getCurrentTab().then((tab) => {
				const otherWindow = windows.filter((filterWindow) => {
					return (filterWindow.id !== tab.windowId);
				});

				chrome.tabs.move(tab.id, {windowId: otherWindow[0].id, index: -1});
				chrome.windows.update(otherWindow[0].id, {focused: true});
				chrome.tabs.update(tab.id, {selected: true});
			});
		} else {
			utils.getCurrentTab().then((tab) => {
				return utils.createTab({url : `../tabbo.html#${tab.id}`});
			}).then(() => {
				const onTabChange = (response) => {
					if (response.tabId !== newTab.id) {
						chrome.tabs.onActivated.removeListener(onTabChange);
						chrome.tabs.get(newTab.id, () => {
							if (!chrome.runtime.lastError) {
								chrome.tabs.remove(newTab.id);
							}
						});
					}
				};

				chrome.tabs.onActivated.addListener(onTabChange);
			});
		}
	});
}

function explodeTabs() {
	utils.getAllWindows({populate: true}).then((chromeWindows) => {
		chromeWindows.forEach((chromeWindow) => {
			chromeWindow.tabs.forEach((tab) => {
				const width = Math.floor((Math.random() * (screen.width * 0.75)) + 1);
				const height = Math.floor((Math.random() * (screen.height * 0.75)) + 1);

				chrome.windows.create({
					tabId: tab.id,
					width: width,
					height: height,
					left: Math.floor(Math.random() * (screen.width - width) + 1),
					top: Math.floor(Math.random() * (screen.height - height) + 1),
				});
			});
		});
	});
}

function joinTabs() {
	utils.getAllWindows({populate: true}).then((chromeWindows) => {
		let isFirstWindow = true;
		let firstWindowId = null;

		chromeWindows.forEach((chromeWindow) =>{
			if (isFirstWindow) {
				isFirstWindow = false;
				firstWindowId = chromeWindow.id;

				// make it fullscreen
				chrome.windows.update(firstWindowId, {
					left: 0,
					top: 0,
					width: screen.width,
					height: screen.height
				});
			} else {
				chromeWindow.tabs.forEach((tab) => {
					chrome.tabs.move(tab.id, {windowId: firstWindowId, index: -1});
				});
			}
		});
	});
}
