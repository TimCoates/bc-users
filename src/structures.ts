
export module structures {

	export class basicPerson {
		name: string;
		clubNo: string;
		expiryDate: string; // This is the club membership expiry date
		emergencyName: string;
		emergencyNumber: string;
		ice: string;

		// Normal signature with defaults
		constructor(name: string, clubNo: string, expiryDate: string, emergencyName: string = "", emergencyNumber: string = "") {
			this.name = name;
			if (clubNo == "0") {
				this.clubNo = "N/A";
			} else {
				this.clubNo = clubNo;
			}
			this.expiryDate = expiryDate; // Sets the club membership expiry date
			this.emergencyName = emergencyName;
			this.emergencyNumber = fixNumber(emergencyNumber);
			this.ice = "";
			if (this.emergencyName != "") {
				if (this.emergencyNumber != "") {
					this.ice = this.emergencyName + " - " + this.emergencyNumber;
				} else {
					this.ice = this.emergencyName;
				}
			} else {
				if (this.emergencyNumber != "") {
					this.ice = this.emergencyNumber;
				} else {
					this.ice = "";
				}
			}

		}
	}

	export class httpResponse {
		statusCode: number;
		body: string;
		constructor(statusCode: number = 200, body: string = "") {
			this.statusCode = statusCode;
			this.body = JSON.stringify({ message: body });
		}
	}

	export class credentials {
		username: string;
		password: string;
		constructor(username: string, password: string) {
			this.username = username;
			this.password = password;
		}
	}

	export class bcPerson {
		id: string = "";// "509884",
		first_name: string = ""; // "Tim",
		last_name: string = ""; // "Coates",
		gender: string = ""; // "Male",
		membership_number: string = ""; // "1206092",
		dob: string = ""; // "22\/05\/1965",
		email: string = ""; // "tim.coates@gmail.com",
		telephone_day: string = ""; //  "07766 687 696",
		emergency_contact_name: string = ""; //  "Rebecca Chaloner",
		emergency_contact_number: string = ""; //  "07786550899",
		restrict_all_email_marketing: string = ""; //  "0",
		zuv_bc_person_organisation_role_id: string = ""; //  "311795",
		end_dt: string = ""; //  "30\/12\/2021",
		primary_club: string = ""; //  "Albarosa Cycling Club",
		oid: string = ""; //  "626760",
		membership_type: string = ""; //  "Active Ride",
		membership_status: string = ""; //  "Active",
		valid_to_dt: string = ""; //  "03\/09\/2021",
		ended_dt: string = ""; //  null,
		expired: string = ""; // Indicates whether their BC membership has lapsed, "0" or "1"
		age_category: string = ""; //  "Senior",
		zuv_bc_custom_field_definition_ids: string = ""; //  "310861",
		custom_field_names: string = "Club No."; // "Club No.",
		custom_field_types: string = ""; //  "2",
		custom_field_data: string = ""; //  "772",
		subscription_type: string = ""; //  "Adult Membership",
		expiring: boolean = false; // Indicates whether their Club Membership is getting close to lapsing close to 
		lapsed: number = 0; // 1,
		"Road & Track Licence Cat": string = "N\/A"; // "N\/A",
		num_payments: number = 0; // 5,
		has_licence: string = ""; // 0,
		custom_field_0: string = ""; // "772" is cmcfd_club_no in bcDetailedPerson
		PROPOSED_end_dt: string = "";
		PROPOSED_clubno: string = "";
		expiry: number = Math.floor(new Date(new Date().setTime(new Date().getTime() + (365 * 86400000))).getTime() / 1000); // Record TTL value for DynamoDB
	}

	export class bcDetailedPerson {
		person_id: string; // See id in bcPerson
		address_id: string;
		is_bc_member: string;
		check_surname: string;
		members_end_dt: string;
		terms_conditions: string;
		salutation: string;
		gender: string;
		acm_first_name: string;
		acm_last_name: string;
		acm_dob: string;
		email: string;
		telephone_evening: string;
		telephone_day: string;
		telephone_mobile: string;
		acm_address_0: string;
		acm_address_1: string;
		acm_address_3: string;
		acm_address_4: string;
		acm_address_5: string;
		acm_cc: string;
		emergency_contact_name: string;
		emergency_contact_number: string;
		membership_end_dt: string; // End of club membership
		// terms_conditions: string;
		cmcfd_club_no: string; // See custom_field_0 Club membership number

		constructor(
			person_id: string,
			address_id: string,
			is_bc_member: string,
			check_surname: string,
			members_end_dt: string,
			terms_conditions: string,
			salutation: string,
			gender: string,
			acm_first_name: string,
			acm_last_name: string,
			acm_dob: string,
			email: string,
			telephone_evening: string,
			telephone_day: string,
			telephone_mobile: string,
			acm_address_0: string,
			acm_address_1: string,
			acm_address_3: string,
			acm_address_4: string,
			acm_address_5: string,
			acm_cc: string,
			emergency_contact_name: string,
			emergency_contact_number: string,
			membership_end_dt: string,
			cmcfd_club_no: string) {
			this.person_id = person_id;
			this.address_id = address_id;
			this.is_bc_member = is_bc_member;
			this.check_surname = check_surname;
			this.members_end_dt = members_end_dt;
			this.terms_conditions = terms_conditions;
			this.salutation = salutation;
			this.gender = gender;
			this.acm_first_name = acm_first_name;
			this.acm_last_name = acm_last_name;
			this.acm_dob = acm_dob;
			this.email = email;
			this.telephone_evening = telephone_evening;
			this.telephone_day = telephone_day;
			this.telephone_mobile = telephone_mobile;
			this.acm_address_0 = acm_address_0;
			this.acm_address_1 = acm_address_1;
			this.acm_address_3 = acm_address_3;
			this.acm_address_4 = acm_address_4;
			this.acm_address_5 = acm_address_5;
			this.acm_cc = acm_cc;
			this.emergency_contact_name = emergency_contact_name;
			this.emergency_contact_number = emergency_contact_number;
			this.membership_end_dt = membership_end_dt;
			this.cmcfd_club_no = cmcfd_club_no;
		}
	}

	export class cookie {
		value: string;
		expires: number;

		constructor(val: string, exp: number) {
			this.value = val;
			this.expires = exp;
		}
	}
}


/** Function to return a number in a nicely formatted way
 *
 * @param {*} input 
 */
function fixNumber(input: string): string {
	let noSpaces: string = "";
	let formatted: string = "";
	if (typeof input !== 'undefined' && input) {


		// If we start with +44 remove any spaces, then space nicely
		if (input.slice(0, 3) === "+44") {
			noSpaces = stripBracesAndSpaces(input);
			formatted = "(" + noSpaces.slice(0, 3) + ") " + noSpaces.slice(3, 7) + " " + noSpaces.slice(7, 10) + " " + noSpaces.slice(10, 13);
			return formatted;
		}

		// Handle numbers starting with 44
		if (input.slice(0, 2) === "44") {
			input = "+" + input;
			noSpaces = stripBracesAndSpaces(input)
			formatted = "(" + noSpaces.slice(0, 3) + ") " + noSpaces.slice(3, 7) + " " + noSpaces.slice(7, 10) + " " + noSpaces.slice(10, 13);
			return formatted;
		}

		// Handle numbers starting with 7
		if (input.slice(0, 1) === "7") {
			input = "0" + input;
			noSpaces = stripBracesAndSpaces(input)
			formatted = noSpaces.slice(0, 5) + " " + noSpaces.slice(5, 8) + " " + noSpaces.slice(8, 11);
			return formatted;
		}

		// Handle numbers starting with 0
		if (input.slice(0, 1) === "0") {
			noSpaces = stripBracesAndSpaces(input)
			formatted = noSpaces.slice(0, 5) + " " + noSpaces.slice(5, 8) + " " + noSpaces.slice(8, 11);
			return formatted;
		}
		// I despair
		return input;
	} else {
		return "";
	}
}

/** Dead simple number to strip spurious chars from the number before we start to format it
 *
 * @param {*} input 
 */
function stripBracesAndSpaces(input: string): string {
	// If we have any brackets, strip them
	input = input.replace(/\(/g, "");
	input = input.replace(/\)/g, "");
	// Any spaces
	input = input.replace(/ /g, "");
	// Hyphens
	input = input.replace(/-/g, "");
	return input;
}

export function bcPersonToBasic(input: structures.bcPerson): structures.basicPerson {
	let output: structures.basicPerson;
	let name: string = input.first_name + " " + input.last_name;
	let clubNo: string = input.custom_field_data;
	let expiry: string = input.end_dt; // Sets club membership expiry date
	let emergencyName: string = input.emergency_contact_name;
	let emergencyNumber: string = input.emergency_contact_number;
	output = new structures.basicPerson(name, clubNo, expiry, emergencyName, emergencyNumber);
	return output;
}

export function bcDetailedPersonToPerson(input: structures.bcDetailedPerson): structures.bcPerson {
	let output: structures.bcPerson;
	output = new structures.bcPerson();
	output.id = input.person_id;
	output.first_name = input.acm_first_name;
	output.last_name = input.acm_last_name;
	output.gender = input.gender;
	output.membership_number = "";
	output.dob = input.acm_dob;
	output.email = input.email;
	output.telephone_day = input.telephone_day;
	output.emergency_contact_name = input.emergency_contact_name;
	output.emergency_contact_number = input.emergency_contact_number;
	output.restrict_all_email_marketing = "0";
	//zuv_bc_person_organisation_role_id: string = ""; //  "311795",
	//end_dt: string = ""; //  "30\/12\/2021",
	//output.primary_club= input.ac
	//oid: string = ""; //  "626760",
	//membership_type: string = ""; //  "Active Ride",
	//membership_status: string = ""; //  "Active",
	//valid_to_dt: string = ""; //  "03\/09\/2021",
	//ended_dt: string = ""; //  null,
	//expired: string = ""; // "0",
	//age_category: string = ""; //  "Senior",
	//zuv_bc_custom_field_definition_ids: string = ""; //  "310861",
	//custom_field_names: string = "Club No."; // "Club No.",
	//custom_field_types: string = ""; //  "2",
	//custom_field_data: string = ""; //  "772",
	//subscription_type: string = ""; //  "Adult Membership",
	//expiring: boolean = false;
	//lapsed: number = 0; // 1,
	//"Road & Track Licence Cat": string = "N\/A"; // "N\/A",
	//num_payments: number = 0; // 5,
	//has_licence: string = ""; // 0,
	//custom_field_0: string = ""; // "772" is cmcfd_club_no in bcDetailedPerson
	//PROPOSED_end_dt: string = "";
	//PROPOSED_clubno: string = "";
	//expiry: number = Math.floor(new Date(new Date().setTime(new Date().getTime() + (365 * 86400000))).getTime() / 1000);
	return output;
}