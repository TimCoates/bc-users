
/** Function to change a number to a fixed length string by zero padding it.
 * 
 * @param input : number
 * @param length : string length
 * @returns 
 */
export function pad(input: number, length: number): string {
	let prefix: string = new Array(length + 1).join("0");
	return (prefix + input.toString()).slice(0 - length);
}

/** Function to get today's date as a string in yyyymmdd format
 * 
 * @returns : string
 */
export function dateString(): string {
	let today = new Date();
	let todayString = today.toISOString(); // gives YYYY-MM-DDTHH:mm:ss.sssZ
	let day: string = pad(Number.parseInt(todayString.substr(8, 2)), 2);
	let month: string = pad(Number.parseInt(todayString.substr(5, 2)), 2);
	let year: string = Number.parseInt(todayString.substr(0, 4)).toString();
	return year + "" + month + day;
}


/**
 * Function to ensure consistent structured log entries.
 * 
 * @param code A unique log reference e.g. ABC-12
 * @param message The log message
 * @param payload An optional object or string
 * @returns void 
 */
export function logThis(code: string, fnName: string, message: string, payload?: any): void {
	let messageObject = {
		code: code,
		function: fnName,
		message: message,
		payload: payload,
		when: new Date().toISOString().substring(0, 16)
	};
	console.log(JSON.stringify(messageObject));
}

