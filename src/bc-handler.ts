import axios from "axios";
import { structures } from "./structures";
let jsdom = require("jsdom");
const { JSDOM } = jsdom;
import { logThis, doCookie } from "./utils";
export class BCClient {
	readonly baseURL: string = "https://www.britishcycling.org.uk";
	private cookie: string = "";
	private readonly username: string;
	private readonly password: string;
	authenticated: boolean = false;

	constructor(username: string, password: string) {
		logThis("BC-01", "constructor", "Called");
		this.username = username;
		this.password = password;
	}

	async authenticate(): Promise<boolean> {
		logThis("BC-10", "authenticate", "called");
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
			logThis("BC-15", "authenticate", "Got a response");

			if (response.data == true) {
				this.authenticated = true;
				logThis("BC-16", "authenticate", "Authenticated");
				let cookies: string[] = response.headers["set-cookie"];
				this.cookie = await doCookie(cookies);
				logThis("BC-17", "authenticate", "got cookie", this.cookie);
				return true;
			} else {
				logThis("BC-18", "authenticate", "Authenticate failed");
				return false;
			}
		} catch (Except) {
			logThis("BC-19", "authenticate", "Exception caught", (Except as Error).stack);
			return false;
		}
	}

	async getMembers(clubID: string): Promise<structures.bcPerson[]> {
		logThis("BC-20", "getMembers", "Called", clubID);
		let members: structures.bcPerson[] = [];
		try {
			if (this.authenticated) {
				logThis("BC-21", "getMembers", "Authenticated so proceeding");
				const url = this.baseURL + "/dashboard/club/membership/ajax_club_members?status=active&club_id=" + clubID;
				logThis("BC-22", "getMembers", "URL", url);
				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie
					}
				};
				logThis("BC-23", "getMembers", "config", config);

				let response = await axios.get(url, config);
				logThis("BC-24", "getMembers", "Response back, member count is", response.data.aaData.length);
				members = response.data.aaData;
			} else {
				logThis("BC-25", "getMembers", "Not authenticated returning empty array");
			}
		} catch (Except) {
			logThis("BC-26", "getMembers", "Exception caught", (Except as Error).stack);
		}
		return members;
	}

	async getSingleMember(clubID: string, membership_number: string): Promise<structures.bcPerson> {
		logThis("BC-30", "getSingleMember", "Called", membership_number);
		try {
			if (this.authenticated) {
				logThis("BC-31", "getSingleMember", "Authenticated so will proceed");
				const url = this.baseURL + "/dashboard/club/membership/ajax_club_members?status=active&club_id=" + clubID;
				logThis("BC-32", "getSingleMember", "url", url);
				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID + "&sSearch=" + membership_number,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie
					}
				};
				logThis("BC-33", "getSingleMember", "config", config);


				let response = await axios.get(url, config);
				logThis("BC-34", "getSingleMember", "Got response");

				if (response.data.iTotalDisplayRecords != "0") {
					logThis("BC-35", "getSingleMember", "Got some records", response.data.iTotalDisplayRecords);
					for (let index: number = 0; index < parseInt(response.data.iTotalDisplayRecords, 10); index++) {
						if (response.data.aaData[index].membership_number == membership_number) {
							logThis("BC-36", "getSingleMember", "Match found, returning it", response.data.aaData[index]);
							return response.data.aaData[index];
						}
					}
					logThis("BC-37", "getSingleMember", "None matched, will throw");
					throw new Error("None of the records from search match");
				} else {
					logThis("BC-38", "getSingleMember", "Got zero records back, will throw", response.data);
					throw new Error("Got 0 records back from search");
				}
			} else {
				logThis("BC-39", "getSingleMember", "Not authenticated, will throw");
				throw new Error("Not authenticated");
			}
		} catch (Except: any) {
			logThis("BC-40", "getSingleMember", "Exception caught, logging but will rethrow", (Except as Error).stack);
			throw new Error(Except);
		}
	}

	async getMember(clubID: string, personID: string): Promise<structures.bcDetailedPerson> {
		logThis("BC-50", "getMember", "Called for person:", personID)

		try {
			if (this.authenticated) {
				logThis("BC-51", "getMember", "Authenticated so will proceed");
				const url = this.baseURL + "/dashboard/club/membership/ajax_add_member_form?club_id=" + clubID + "&person_id=" + personID;
				logThis("BC-52", "getMember", "url", url);

				let config: any = {
					headers: {
						"referer": "https://www.britishcycling.org.uk/dashboard/club/membership?club_id=" + clubID,
						"x-requested-with": "XMLHttpRequest",
						"Content-Type": "application/x-www-form-urlencoded",
						"cookie": this.cookie
					}
				};
				logThis("BC-53", "getMember", "config", config);

				let response = await axios.get(url, config);
				logThis("BC-54", "getMember", "Got response");
				let personHTML: string = response.data;
				logThis("BC-55", "getMember", "html", personHTML);

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
				logThis("BC56", "getMember", "Got data from html", obj);

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
				logThis("BC-57", "getMember", "Created and returning person", person);
				return person;
			} else {
				logThis("BC-58", "getMember", "Not authenticated");
			}
		} catch (Except) {
			logThis("BC-59", "getMember", "Exception caught", (Except as Error).stack);
		}
		logThis("BC-60", "getMember", "Returning empty person");
		return new structures.bcDetailedPerson("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
	}

	getItemsFromDOM(html: string, itemlist: string[]): any {
		//logThis("BC-80", "getItemsFromDOM", "Called", html);
		logThis("BC-91", "getItemsFromDOM", "Called", itemlist);

		let returnVal: any = {};
		let dom = new JSDOM(html);
		logThis("BC-92", "getItemsFromDOM", "got DOM");


		for (let item of itemlist) {
			let itemName: string = (item as string);
			if (dom.window.document.getElementById(itemName) != null) {
				logThis("BC-93", "getMember", "Setting " + item + " to: " + dom.window.document.getElementById(itemName).value);
				returnVal[(itemName as string)] = (dom.window.document.getElementById(itemName).value as string);
			} else {
				returnVal[(itemName as string)] = "";
				logThis("BC-94", "getMember", "No " + itemName + " set");
			}
		}
		logThis("BC-95", "getItemsFromDOM", "Returning this object", returnVal);
		return returnVal;
	}
}