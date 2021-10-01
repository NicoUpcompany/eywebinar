import { basePath, apiVersion } from "./config";

export function getClapsApi(token) {
	const url = `${basePath}/${apiVersion}/claps`;

	const params = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};

	return fetch(url, params)
		.then((resp) => {
			return resp.json();
		})
		.then((result) => {
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}

export function postClapsApi(token, data) {
	const url = `${basePath}/${apiVersion}/claps`;

	const params = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};

	return fetch(url, params)
		.then((resp) => {
			return resp.json();
		})
		.then((result) => {
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}
