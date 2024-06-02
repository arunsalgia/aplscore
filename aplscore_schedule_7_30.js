path = require('path');
cookieParser = require('cookie-parser');
const { Console } = require('console');
const { promisify } = require('util')
const sleep = promisify(setTimeout);
logger = require('morgan');
axios = require('axios');

const RETRYCOUNT = 3;
/// make mongoose connection



// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  process.exit(0);
});

function ProgramExit() {
	process.exit(0);
}

async function process_Score() {
	var status = false;
	for(let i=0; i < RETRYCOUNT; ++i) { 
		try {
			let myUrl = `https://aplscore.herokuapp.com/match/updatescore`;
			console.log(myUrl);
			var result = await axios.get(myUrl);
			status = result.data.status;
			break;
		} catch (e) {
			console.log("Error updating score");
		}
	}
	return status;
}

const SLEEPTIMEMIN = 5;
const SLEEPTIMEMS = SLEEPTIMEMIN*60*1000;
const MAXTIMEMIN = 330;
const MINTRYCOUNT = 1;
(async () => {

	var count = 0;
	var stopTime = new Date();
	stopTime.setMinutes(stopTime.getMinutes()+MAXTIMEMIN);
	console.log(stopTime.toString());
	var allDone = false;
	while (!allDone) {
		allDone = await process_Score();
		console.log("Before Count ",count, allDone);
		count = count + 1;
		if (count <= MINTRYCOUNT) 
			allDone = false;
		console.log("After Count ",allDone);
		var tmp = new Date();
		console.log(tmp.getTime(), stopTime.getTime());
		if (tmp.getTime() > stopTime.getTime()) 
		{ 
			console.log("Time over breaking."); 
			break; 
		}
		console.log("Checking for sleep");
		if (!allDone)  {
			console.log(`Sleeping for ${SLEEPTIMEMIN} minutes`);
			await sleep(SLEEPTIMEMS);
			console.log(`Awake`);
		}
		console.log("Sleep task done");
	}
	
	ProgramExit();

})();




