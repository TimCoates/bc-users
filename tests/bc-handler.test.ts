
const BCClient = require("../src/bc-handler.ts");
describe("test constructor", () => {
	it("Should construct", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
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

	it("Should be authenticated after authenticating", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		client.authenticate();
		expect(client.authenticated).toBe(true);
	});

});