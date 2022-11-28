
const BCClient = require("../src/index");
import { structures } from "../src/structures";
describe("test constructor", () => {
	it("Should construct", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		expect(client).not.toBe(null);
	});

	it("Should construct with default logging", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		expect(client).not.toBe(null);
	});


	it("Should construct with explicit logging", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password, true);
		expect(client).not.toBe(null);
	});

	it("Should construct without explicit logging", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password, false);
		expect(client).not.toBe(null);
	});


});

describe("test authenticate", () => {
	it("Should not be authenticated initially", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		expect(client.authenticated).toBe(false);
	});

	it("Should be authenticated after authenticating", async () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		let result = await client.authenticate();
		expect(result).toBe(true);
		expect(client.authenticated).toBe(true);
	});

	it("Should NOT be authenticated after authenticating with wrong credentials", async () => {
		let username = process.env.BC_USERNAME;
		let password = "Mallory";
		let client = new BCClient.BCClient(username, password);
		let result = await client.authenticate();
		expect(result).toBe(false);
		expect(client.authenticated).toBe(false);
	});
});

describe("test getMembers", () => {

	it("Should not get anyone initially", async () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		let people: structures.bcPerson[] = await client.getMembers(process.env.BC_CLUBID);
		expect(people.length).toBe(0);
	});

	it("Should get people once authenticated", async () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		let result = await client.authenticate();
		let people: structures.bcPerson[] = await client.getMembers(process.env.BC_CLUBID);
		expect(result).toBe(true);
		expect(people.length).toBeGreaterThan(1);
	});

	it("Should not get people from a wrong club once authenticated", async () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		let result = await client.authenticate();
		let people: structures.bcPerson[] = await client.getMembers("1234");
		expect(people.length).toBe(0);
	});
});
