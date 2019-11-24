import { getJson } from './base-api';
const TRAIN_SERVICE_URL = `http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=${process.env.MARTA_API_KEY}`;

function getTrainService() {
	return getJson(TRAIN_SERVICE_URL, { useHttps: false });
}

export async function getTrainLines() {
	const result = await getTrainService();
	// result.forEach
}