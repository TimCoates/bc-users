import axios from "axios";
import { structures } from "./structures";
let jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

	async getSingleMember(clubID: string, membership_number: string): Promise<structures.bcPerson> {
		this.logThis("BC-30", "getSingleMember", "Called", membership_number);
		try {
			if (this.authenticated) {
				this.logThis("BC-31", "getSingleMember", "Authenticated so will proceed");
				const url = this.baseURL + "/dashboard/club/membership/ajax_club_members?status=active&club_id=" + clubID;
				this.logThis("BC-32", "getSingleMember", "url", url);
				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID + "&sSearch=" + membership_number,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie
					}
				};
				this.logThis("BC-33", "getSingleMember", "config", config);


				let response = await axios.get(url, config);
				this.logThis("BC-34", "getSingleMember", "Got response");

				if (response.data.iTotalDisplayRecords != "0") {
					this.logThis("BC-35", "getSingleMember", "Got some records", response.data.iTotalDisplayRecords);
					for (let index: number = 0; index < parseInt(response.data.iTotalDisplayRecords, 10); index++) {
						if (response.data.aaData[index].membership_number == membership_number) {
							this.logThis("BC-36", "getSingleMember", "Match found, returning it", response.data.aaData[index]);
							return response.data.aaData[index];
						}
					}
					this.logThis("BC-37", "getSingleMember", "None matched, will throw");
					throw new Error("None of the records from search match");
				} else {
					this.logThis("BC-38", "getSingleMember", "Got zero records back, will throw", response.data);
					throw new Error("Got 0 records back from search");
				}
			} else {
				this.logThis("BC-39", "getSingleMember", "Not authenticated, will throw");
				throw new Error("Not authenticated");
			}
		} catch (Except: any) {
			this.logThis("BC-40", "getSingleMember", "Exception caught, logging but will rethrow", (Except as Error).stack);
			throw new Error(Except);
		}
	}

	async getMember(clubID: string, personID: string): Promise<structures.bcDetailedPerson> {
		this.logThis("BC-50", "getMember", "Called for person:", personID)

		try {
			if (this.authenticated) {
				this.logThis("BC-51", "getMember", "Authenticated so will proceed");
				const url = this.baseURL + "/dashboard/club/membership/ajax_add_member_form?club_id=" + clubID + "&person_id=" + personID;
				this.logThis("BC-52", "getMember", "url", url);

				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie
					}
				};
				this.logThis("BC-53", "getMember", "config", config);

				let response = await axios.get(url, config);
				this.logThis("BC-54", "getMember", "Got response");
				let personHTML: string = response.data;
				this.logThis("BC-55", "getMember", "html", personHTML);

				//let dom = new JSDOM(personHTML);
				let itemList = [
					"person_id",
					"salutation",
					"gender",
					"country",
					"address_id",
					"is_bc_member",
					"check_surname",
					"members_end_dt",
					"terms_conditions",
					"acm_first_name",
					"acm_last_name",
					"acm_dob",
					"email",
					"telephone_evening",
					"telephone_day",
					"telephone_mobile",
					"acm_address_0",
					"acm_address_1",
					"acm_address_3",
					"county",
					"acm_address_5",
					"emergency_contact_name",
					"emergency_contact_number",
					"membership_end_dt",
					"cmcfd_club_no"
				];

				let obj: any = this.getItemsFromDOM(personHTML, itemList);
				this.logThis("BC56", "getMember", "Got data from html", obj);

				let person = new structures.bcDetailedPerson(
					obj.person_id,
					obj.address_id,
					obj.is_bc_member,
					obj.check_surname,
					obj.members_end_dt,
					obj.terms_conditions,
					obj.salutation,
					obj.gender,
					obj.acm_first_name,
					obj.acm_last_name,
					obj.acm_dob,
					obj.email,
					obj.telephone_evening,
					obj.telephone_day,
					obj.telephone_mobile,
					obj.acm_address_0,
					obj.acm_address_1,
					obj.acm_address_3,
					obj.county,
					obj.acm_address_5,
					obj.country,
					obj.emergency_contact_name,
					obj.emergency_contact_number,
					obj.membership_end_dt,
					obj.cmcfd_club_no
				);
				this.logThis("BC-57", "getMember", "Created and returning person", person);
				return person;
			} else {
				this.logThis("BC-58", "getMember", "Not authenticated");
			}
		} catch (Except) {
			this.logThis("BC-59", "getMember", "Exception caught", (Except as Error).stack);
		}
		this.logThis("BC-60", "getMember", "Returning empty person");
		return new structures.bcDetailedPerson("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
	}

	getItemsFromDOM(html: string, itemlist: string[]): any {
		//logThis("BC-80", "getItemsFromDOM", "Called", html);
		this.logThis("BC-91", "getItemsFromDOM", "Called", itemlist);

		let returnVal: any = {};
		let dom = new JSDOM(html);
		this.logThis("BC-92", "getItemsFromDOM", "got DOM");


		for (let item of itemlist) {
			let itemName: string = (item as string);
			if (dom.window.document.getElementById(itemName) != null) {
				this.logThis("BC-93", "getMember", "Setting " + item + " to: " + dom.window.document.getElementById(itemName).value);
				returnVal[(itemName as string)] = (dom.window.document.getElementById(itemName).value as string);
			} else {
				returnVal[(itemName as string)] = "";
				this.logThis("BC-94", "getMember", "No " + itemName + " set");
			}
		}
		this.logThis("BC-95", "getItemsFromDOM", "Returning this object", returnVal);
		return returnVal;
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