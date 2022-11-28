# bc-users
Retrieves users of a club where members are managed via British Cycling's Club Manager tool.

# Installation
npm install @timcoates/bc-users

# Prerequisites
You need the following details to use this package:
* A British Cycling Membership number.
* The password for that Membership number, used to log in [here](https://www.britishcycling.org.uk/uac/connect).
* The Club ID, as found when searching for the club [here](https://www.britishcycling.org.uk/clubfinder).

NB: The membership number must have access to the Club Membership details here: https://www.britishcycling.org.uk/dashboard/club/membership?club_id= (Club ID goes here).

# Useful links
[Documentation](https://timcoates.github.io/bc-users/)

[British Cycling website](https://www.britishcycling.org.uk/)

[Git Repo](https://github.com/TimCoates/bc-users)

[Issues](https://github.com/TimCoates/bc-users/issues)


# Usage
## Installation
```
npm install @timcoates/bc-users
```

## Use
```
let BCClient = require("@timcoates/bc-users");

let logging = true;  // Optional. Defaults to no logging.
let client = new BCClient([username], [password], logging);
let result = await client.authenticate();

if(result) {
	let people: structures.bcPerson[] = await client.getMembers([BC_CLUBID]);
	// people is now an array of the club members' details.
}
```