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

window.utils = utils;
