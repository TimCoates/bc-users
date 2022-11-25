
let BCClient = require("./bc-handler.ts");
describe("test constructor", () => {
	it("should work", () => {
		let username = process.env.BC_USERNAME;
		let password = process.env.BC_PASSWORD;
		let client = new BCClient.BCClient(username, password);
		console.log(username);
		expect(true).toBe(true);
	});
});