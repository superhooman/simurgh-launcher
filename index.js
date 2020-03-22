'use strict';
const path = require('path');
const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const contextMenu = require('electron-context-menu');

const {Client, Authenticator} = require('./MCLC');

unhandled();
contextMenu();

app.setAppUserModelId('com.uenify.simurgh');

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		width: 425,
		height: 650,
		minWidth: 390,
		backgroundColor: '#ffffff',
		minHeight: 450,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'app/index.html'));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

ipc.on('launch', (event, data) => {
	const launcher = new Client();

	const opts = {
		clientPackage: null,
		authorization: Authenticator.getAuth(data.username, data.password),
		root: path.join(__dirname, '/minecraft'),
		version: {
			number: '1.15.2',
			type: 'release'
		},
		memory: {
			max: '6000',
			min: '4000'
		}
	};

	launcher.launch(opts);

	launcher.on('arguments', () => {
		mainWindow.webContents.send('setState', {
			status: 'launched'
		});
	});

	launcher.on('close', () => {
		mainWindow.webContents.send('setState', {
			status: 'init'
		});
	});

	launcher.on('download-status', data => {
		const percent = Math.round((data.current / data.total) * 100);
		mainWindow.webContents.send('setState', {
			status: 'downloading',
			name: data.name,
			percent
		});
	});
});
