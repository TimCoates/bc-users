import axios from "axios";
import { structures } from "./structures";

export class BCClient {
	readonly baseURL: string = "https://www.britishcycling.org.uk";
	private cookie: string = "";
	private readonly username: string;
	private readonly password: string;
	authenticated: boolean = false;
	private logging: boolean = false;

	/** Constructor to create the British Cycling client
	 * 
	 * @param username A username from the BC website
	 * @param password A password from the BC website
	 * @param logging Boolean (optional) gives the ability to turn on logging (defaults to off)
	 */
	constructor(username: string, password: string, logging: boolean = false) {
		if (typeof logging !== "undefined") {
			this.logging = logging;
		} else {
			this.logging = false;
		}
		this.logThis("BC-01", "constructor", "Called");
		this.username = username;
		this.password = password;
	}

	/** Used toauthenticate the client using the credentials provided in the constructor.
	 * 
	 * @returns 
	 */
	async authenticate(): Promise<boolean> {
		this.logThis("BC-10", "authenticate", "called");
		try {
			const url = this.baseURL + "/ajax/ajax_sign_in";
			const params = new URLSearchParams()
			params.append("username2", this.username);
			params.append("password2", this.password);
			params.append("remember_me", "1");
			params.append("validcode", "");

			let config: any = {
				headers: {
					"x-requested-with": "XMLHttpRequest",
					"Content-Type": "application/x-www-form-urlencoded"
				}
			};

			let response = await axios.post(url, params, config);
			this.logThis("BC-15", "authenticate", "Got a response");

			if (response.data == true) {
				this.authenticated = true;
				this.logThis("BC-16", "authenticate", "Authenticated");
				let cookies: string[] = response.headers["set-cookie"];
				this.cookie = await this.doCookie(cookies);
				this.logThis("BC-17", "authenticate", "got cookie", this.cookie);
				return true;
			} else {
				this.logThis("BC-18", "authenticate", "Authenticate failed");
				return false;
			}
		} catch (Except) {
			this.logThis("BC-19", "authenticate", "Exception caught", (Except as Error).stack);
			return false;
		}
	}

	async getMembers(clubID: string): Promise<structures.bcPerson[]> {
		this.logThis("BC-20", "getMembers", "Called", clubID);
		let members: structures.bcPerson[] = [];
		try {
			if (this.authenticated) {
				this.logThis("BC-21", "getMembers", "Authenticated so proceeding");
				const url = this.baseURL + "/dashboard/club/membership/ajax_club_members?status=active&club_id=" + clubID;
				this.logThis("BC-22", "getMembers", "URL", url);
				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie,
						"accept-encoding": "gzip;q=0"
					}
				};
				this.logThis("BC-23", "getMembers", "config", config);

				let response = await axios.get(url, config);
				let headers = response.headers;
				this.logThis("BC-24", "getMembers", "Response back, member count is", response.data.aaData.length);
				members = response.data.aaData;
			} else {
				this.logThis("BC-25", "getMembers", "Not authenticated returning empty array");
			}
		} catch (Except) {
			this.logThis("BC-26", "getMembers", "Exception caught", (Except as Error).stack);
		}
		return members;
	}

	/**
	 * 
	 * @param cookies 
	 */
	async doCookie(cookies: string[]): Promise<string> {
		this.logThis("BC-90", "doCookie", "called", cookies);
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
		this.logThis("BC-91", "doCookie", "Got cookie", cookie);
		this.logThis("BC-92", "doCookie", "Got cookie expiry", cookieExpiry);
		this.logThis("BC-96", "doCookie", "Returning cookie", cookie);
		return cookie;
	}

	/**
	 * Function to ensure consistent structured log entries.
	 * 
	 * @param code A unique log reference e.g. ABC-12
	 * @param message The log message
	 * @param payload An optional object or string
	 * @returns void 
	 */
	logThis(code: string, fnName: string, message: string, payload?: any): void {
		if (this.logging === true) {
			let messageObject = {
				code: code,
				function: fnName,
				message: message,
				payload: payload,
				when: new Date().toISOString().substring(0, 16)
			};
			console.log(JSON.stringify(messageObject));
		}
	}

}