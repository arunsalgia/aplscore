path = require('path');
cookieParser = require('cookie-parser');
const { Console } = require('console');
const { promisify } = require('util')
const sleep = promisify(setTimeout);
logger = require('morgan');
axios = require('axios');

const RETRYCOUNT = 3;
/// make mongoose connection

const URL = `https://aplscore.herokuapp.com`;
const DEBUG_URL = `http://localhost:4000`;
const DEBUG_MODE = false;


const SLEEPTIMEMIN = 5;
const SLEEPTIMEMS = SLEEPTIMEMIN*60*1000;
const MAXTIMEMIN = 10;
const MINTRYCOUNT = 1;

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
			let myUrl = (DEBUG_MODE ? DEBUG_URL : URL ) + `/match/updatescore/${MAXTIMEMIN}`;
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

(async () => {

	var count = 0;
   allDone = await process_Score();
   console.log(allDone);
   console.log("End of task");
	ProgramExit();

})();




