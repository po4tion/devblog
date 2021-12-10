import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

export const beforeSignup = async user => {
	const result = await axios
		.post('/api/auth/beforeSignup', user)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const signupAxios = async token => {
	const result = await axios
		.post('/api/auth/signup', token)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const signinAxios = async user => {
	const result = await axios
		.post('/api/auth/signin', user)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const signoutAxios = async next => {
	removeCookie('access-token');
	removeLocalStorage('user');
	localStorage.removeItem('blog');
	next();

	const result = await axios
		.get('/api/auth/signout')
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const deleteUserInfo = async token => {
	const result = await axios
		.delete('/api/auth/deleteUser', {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const setCookie = (key, value) => {
	if (process.browser) {
		Cookies.set(key, value, {
			expires: 1,
		});
	}
};

export const getCookie = key => {
	if (process.browser) {
		return Cookies.get(key);
	}
};

export const removeCookie = key => {
	if (process.browser) {
		Cookies.remove(key, {
			expires: 1,
		});
	}
};

export const setLocalStorage = (key, data) => {
	if (process.browser) {
		localStorage.setItem(key, JSON.stringify(data));
	}
};

export const removeLocalStorage = key => {
	if (process.browser) {
		localStorage.removeItem(key);
	}
};

export const updateLocalStorage = (user, next) => {
	if (process.browser) {
		if (localStorage.getItem('user')) {
			localStorage.setItem('user', JSON.stringify(user));
			next();
		}
	}
};

export const authenticate = (value, next) => {
	setCookie('access-token', value.token);
	setLocalStorage('user', value.data);
	next();
};

export const isAuth = () => {
	if (process.browser) {
		const hasCookie = getCookie('access-token');

		if (hasCookie) {
			if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'));
			} else {
				return false;
			}
		}
	}
};

export const findForgotPwd = async email => {
	const result = axios
		.put('/api/password/forgot', email)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const setResetPwd = async value => {
	const result = axios
		.put(`/api/password/reset`, value)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};
