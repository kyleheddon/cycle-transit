import * as https from 'https';
import * as http from 'http';

export function getJson(url, options = { useHttps: true }) {
	const { useHttps } = options;
	const protocol = useHttps ? https : http;
	return new Promise((resolve) => {
		protocol.get(url, (res) => {
			let rawData = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				resolve(JSON.parse(rawData));
			});
		});
	});
}
