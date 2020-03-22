import axios from 'axios';

export const server = 'https://mc.uenify.com/';

let currentAuthToken = localStorage.getItem('token') || null;
let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

export const getToken = () => currentAuthToken;
export const getUser = () => currentUser;

export const setToken = (user, token, remember) => {
	currentAuthToken = token;
	currentUser = user;
	if (remember) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
	}
};

export const request = options => {
	return axios({
		...options,
		url: server + options.url,
		headers: {
			Authorization: `Bearer ${currentAuthToken}`
		}
	});
};
