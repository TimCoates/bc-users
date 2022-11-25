
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

/**
 * 
 * @param cookies 
 */
export async function doCookie(cookies: string[]): Promise<string> {
	logThis("BC-90", "doCookie", "called", cookies);
	let cookie: string = "";
	let cookieExpiry: string = "";
	for (let item of cookies) {
		if (item.startsWith("ZUVVI=")) {
			cookie = item.split(":")[0] + "; ";
			let cookieParts = item.split(";");
			for (let part of cookieParts) {
				if (part.trim().toLowerCase().startsWith("expires")) {
					cookieExpiry = item.split(";")[1].split("=")[1];
				}
			}
		}
	}
	if (cookie.length > 0) {
		cookie = cookie.split(";")[0] + ";";
	}
	logThis("BC-91", "doCookie", "Got cookie", cookie);
	logThis("BC-92", "doCookie", "Got cookie expiry", cookieExpiry);
	logThis("BC-96", "doCookie", "Returning cookie", cookie);
	return cookie;
}
