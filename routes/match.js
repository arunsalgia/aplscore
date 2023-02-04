const { GroupMemberCount, akshuGetGroup, akshuUpdGroup, akshuUpdGroupMember, 
		akshuUpdUser, akshuGetUser, akshuGetTournament } = require('./cricspecial'); 
var router = express.Router();


// modified on 17th October 2021
async function update_scores_direct(mid, cricData) {
	var currtime = new Date(); 
	let mmm = await CricapiMatch.findOne({mid: mid});
	let myTournament = mmm.tournament;
  if (mid) { 
		await updateTournamentStarted(myTournament);   
		let thisMatchOver = true ;
		//console.log(`Match Id: ${mmm.mid}  End: ${mmm.matchEndTime} Over sts: ${thisMatchOver} MOM: ${manofthematchPID}`);

		let matchStat= mongoose.model(myTournament.name, StatSchema);
		let briefStat =  mongoose.model(myTournament.name+BRIEFSUFFIX, BriefStatSchema);
	
		let allmatchentries = await matchStat.find({mid: mid})
		console.log()
	
		if (thisMatchOver) {
			mmm.matchEnded = true;
			await mmm.save();
			await checkTournamentOver(mmm.tournament);
		}     
	}
	return;
}


/* GET all users listing. */
router.use('/', function(req, res, next) {
  // MatchRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
  
	console.log(req.url);
  
  next('route');
});

router.get('/score/:tournamentName/:mid', async function(req, res) {
  setHeader(res);
  var {tournamentName, mid} = req.params;
	tournamentName = tournamentName.toUpperCase();
	mid = Number(mid);
	
	
  let matchStat= mongoose.model(tournamentName, StatSchema);

  let matchScore = await matchStat.find({mid: mid});
	//console.log(matchScore);
	
  sendok(res, matchScore);
});

router.get('/setscore/:tournamentName/:mid/:matchType/:scoreList', async function(req, res) {
  setHeader(res);
  var {tournamentName, mid, matchType, scoreList} = req.params;
	tournamentName = tournamentName.toUpperCase();
	mid = Number(mid);

	
	// declare as started
	let myMatch = await CricapiMatch.findOne({mid: mid});
	myMatch.matchStarted = true;
	myMatch.save();

	// now update player stats
	let matchStat = mongoose.model(tournamentName, StatSchema);
	
	scoreList = JSON.parse(scoreList);
	let pidList = _.map(scoreList, 'pid');
	pidList = _.uniqBy(pidList);
	//console.log(pidList);
	//console.log(scoreList);
	/*
	    mid: 12110171,
    pid: 9968001,
    playerName: 'Aqib Ilyas',
    run: 0,
    four: 0,
    six: 0,
    duck: 0,
    wicket: 0,
    maiden: 0,
    economy: 0,
    runout: 0,
    stumped: 0,
    catch: 0,
    manOfTheMatch: false

	*/
	
	await matchStat.deleteMany({mid: mid });
	//let newScore = [];
	for(let scr=0; scr<scoreList.length; ++scr) {
		let s = scoreList[scr];
		let myRec = getBlankStatRecord(matchStat);
		myRec.mid = s.mid;
		myRec.pid = s.pid;
		myRec.inning = 1;
		myRec.playerName = s.playerName;
		// batting details
		myRec.run = s.run;
		myRec.four = s.four;
		myRec.six = s.six;
		// bowling details
		myRec.wicket = s.wicket;
		myRec.ballsPlayed = s.ballsPlayed;
		myRec.hattrick = s.hattrick;
		myRec.maiden = s.maiden;
		myRec.oversBowled = s.oversBowled;
		// fielding details
		myRec.runout = s.runout;
		myRec.stumped = s.stumped;
		myRec.catch = s.catch;
		myRec.catch3 = (s.catch >= 3) ? 1 : 0;
		myRec.duck = s.duck;
		// overall performance
		myRec.manOfTheMatch = s.manOfTheMatch;
		
		

		// update for century, 
		var dataRange = BonusRunRange.find( x => x.matchType === matchType).range;
		for(i=0; i<dataRange.length; ++i) {
			//console.log("data: ", s.run, dataRange[i].runs, dataRange[i].field);
			if (s.run >= dataRange[i].runs) {
				myRec[dataRange[i].field] = 1;
				break;
			}
		}
		
		
		if (myRec.hattrick === 0) {
		var dataRange = BonusWicketRange.find( x => x.matchType === matchType).range;
			for(i=0; i<dataRange.length; ++i) {
				//console.log("data: ", s.run, dataRange[i].runs, dataRange[i].field);
				if (s.wicket >= dataRange[i].wickets) {
					myRec[dataRange[i].field] = 1;
					break;
				}
			}
		}

		// now update economy value and economy points
		myRec.economyValue = s.economyValue;
		myRec.economy = 0;
		if (myRec.oversBowled >= MinOvers[matchType]) {
			var dataRange = BonusEconomyRange.find( x => x.matchType === matchType).range;
			for(var i=0; i<dataRange.length; ++i) {
				if (myRec.economyValue <= dataRange[i].economyValue) {
					myRec.economy = dataRange[i].points;
					break;
				}
			}
		} 

		// now update the strike rate and strike rate points
		myRec.strikeRateValue = s.strikeRateValue
		myRec.strikeRate = 0;
		if (myRec.ballsPlayed >= MinBallsPlayed[matchType]) {
			console.log("Calculating SR points for "+myRec.strikeRateValue);
			var dataRange = BonusStrikeRateRange.find(x => x.matchType === matchType).range;
			for(var i=0; i<dataRange.length; ++i) {
				console.log(dataRange[i].strikeRate);
				if (myRec.strikeRateValue >= dataRange[i].strikeRate) {
					myRec.strikeRate = dataRange[i].points;
					break;
				}
			}
		} 
		
		
		//console.log(matchType);
		//console.log(myRec);
		myRec.score = calculateScore(myRec, matchType);
		await myRec.save();
	};
	
	await calculateBrief(tournamentName);
  sendok(res, "Done");
});

router.get('/updatebrief/:tournamentName', async function(req, res, next) {
	setHeader(res);
  var {tournamentName} = req.params;
	tournamentName = tournamentName.toUpperCase();
	await calculateBrief(tournamentName);
  sendok(res, "Done");
});


router.get('/matchinfo/:myGroup', async function(req, res, next) {
  // MatchRes = res;  
  setHeader(res);
  
  var {myGroup} = req.params;
  var groupRec = await IPLGroup.findOne({gid: myGroup});
  if (groupRec)
    sendMatchInfoToClient(res, groupRec.gid, SENDRES);
  else
    senderr(res, 662, `Invalid group ${myGroup}`);
});

router.get('/setclose/:tournamentName/:mid', async function(req, res) {
  setHeader(res);
  var {tournamentName, mid} = req.params;
	
	let success = true;
	let myMatch = await CricapiMatch.findOne({mid: mid});
	if (myMatch) {
		myMatch.matchEnded = true;
		myMatch.save()
	} else
		success = false;
	
	// check for tournament over 
	
	return (success) ? sendok(res, "Ok") : senderr(res, 601, "Error");
});


router.get('/add/:tournamentName/:type/:mid/:team1/:team2/:matchTime', async function(req, res, next) {  
  setHeader(res);
	var {tournamentName, type, mid, team1, team2, matchTime} = req.params;
	tournamentName = tournamentName.toUpperCase();
	type = type.toUpperCase();
	team1 = team1.toUpperCase();
	team2 = team2.toUpperCase();
	mid = Number(mid);
	let myDateTime = new Date(Number(matchTime))
	/*
	CricapiMatchSchema = mongoose.Schema({
  mid: Number,
  tournament: String,
  team1: String,
  team2: String,
  weekDay: String,
  type: String,
  matchStarted: Boolean,
  matchEnded: Boolean,
  matchStartTime: Date,
  matchEndTime: Date,
  squad: Boolean
	*/
  
	
	let matchRec = await CricapiMatch.findOne({mid : mid});
	if (matchRec) return senderr(res, 601, "Duplicate Match");
	
	matchRec = new CricapiMatch();
	matchRec.mid = mid;
	matchRec.tournament = tournamentName;
	matchRec.team1 = team1;
	matchRec.team2 = team2;
  matchRec.weekDay = weekDays[myDateTime.getDay()]
	matchRec.squad = true;
	matchRec.type = type;
	matchRec.matchStarted = false;
	matchRec.matchEnded = false;
	matchRec.matchStartTime = myDateTime;
	let endTime = _.cloneDeep(myDateTime);
	switch (type) {
		case "T20": endTime.setHours(endTime.getHours()+5); break;
		case "ODI": endTime.setHours(endTime.getHours()+9); break;
		case "TEST":
			endTime.setDate(endTime.getDate()+5); 
			endTime.setHours(endTime.getHours()+9);
			break;
	}
	matchRec.matchEndTime = endTime;
	matchRec.save();
	sendok(res, matchRec);
});

router.get('/update/:tournamentName/:type/:mid/:team1/:team2/:matchTime', async function(req, res, next) {  
  setHeader(res);
	var {tournamentName, type, mid, team1, team2, matchTime} = req.params;
	tournamentName = tournamentName.toUpperCase();
	type = type.toUpperCase();
	team1 = team1.toUpperCase();
	team2 = team2.toUpperCase();
	mid = Number(mid);
	let myDateTime = new Date(Number(matchTime))
	/*
	CricapiMatchSchema = mongoose.Schema({
  mid: Number,
  tournament: String,
  team1: String,
  team2: String,
  weekDay: String,
  type: String,
  matchStarted: Boolean,
  matchEnded: Boolean,
  matchStartTime: Date,
  matchEndTime: Date,
  squad: Boolean
	*/
  
	
	let matchRec = await CricapiMatch.findOne({mid : mid});
	if (!matchRec) return senderr(res, 601, "Invalid Match ID");
	
	//matchRec.mid = mid;
	matchRec.tournament = tournamentName;
	matchRec.team1 = team1;
	matchRec.team2 = team2;
  matchRec.weekDay = weekDays[myDateTime.getDay()]
	matchRec.squad = true;
	matchRec.type = type;
	matchRec.matchStarted = false;
	matchRec.matchEnded = false;
	matchRec.matchStartTime = myDateTime;
	let endTime = _.cloneDeep(myDateTime);
	switch (type) {
		case "T20": endTime.setHours(endTime.getHours()+5); break;
		case "ODI": endTime.setHours(endTime.getHours()+9); break;
		case "TEST":
			endTime.setDate(endTime.getDate()+5); 
			endTime.setHours(endTime.getHours()+9);
			break;
	}
	matchRec.matchEndTime = endTime;
	matchRec.save();
	sendok(res, matchRec);
});

router.get('/delete/:mid', async function(req, res, next) {  
  setHeader(res);
	var {mid} = req.params;

	mid = Number(mid);
	await CricapiMatch.deleteOne({mid: mid});
	sendok(res, "delete match");
});


router.get('/list/tournament/:tournamentName', async function(req, res, next) {
  // MatchRes = res;  
  setHeader(res);
	/*
	CricapiMatchSchema = mongoose.Schema({
  mid: Number,
  tournament: String,
  team1: String,
  team2: String,
  weekDay: String,
  type: String,
  matchStarted: Boolean,
  matchEnded: Boolean,
  matchStartTime: Date,
  matchEndTime: Date,
  squad: Boolean
	*/
  var {tournamentName} = req.params;
	tournamentName = tournamentName.toUpperCase();
	
	
	let matchRecs = await CricapiMatch.find({tournament : tournamentName});
	console.log(matchRecs[0]);
	sendok(res, matchRecs);
});

async function orgsendMatchInfoToClient(res, igroup, doSendWhat) {
  // var igroup = _group;
  var currTime = new Date();
  currTime.setDate(currTime.getDate())
  var myGroup = await IPLGroup.find({"gid": igroup})
  var myMatches = await CricapiMatch.find({tournament: myGroup[0].tournament});
  console.log(myGroup[0].tournament);
  
  // get current match list (may be 2 matches are running). So send it in array list
  // var tmp = _.filter(myMatches, x => (x.matchStarted || _.gte (currTime, x.matchStartTime)) && (x.matchEnded || _.lte(currTime,x.matchEndTime)));
  var tmp = _.filter(myMatches, x => _.gte (currTime, x.matchStartTime) && x.matchEnded === false);
  var currMatches = [];
  tmp.forEach(m => {
    // console.log(m.matchStartTime);
    currMatches.push({team1: cricTeamName(m.team1), team2: cricTeamName(m.team2), matchTime: cricDate(m.matchStartTime)});
  })
  // console.log(currMatches);
  // now get upcoming match. Limit it to 5
  const upcominCount = 5;
  tmp = _.filter(myMatches, x => _.gte(x.matchStartTime, currTime));
  tmp = _.sortBy(tmp, 'matchStartTime');
  tmp = _.slice(tmp, 0, upcominCount);
  var upcomingMatches = [];
  tmp.forEach(m => {
    // console.log(m.matchStartTime);
    upcomingMatches.push({team1: cricTeamName(m.team1), team2: cricTeamName(m.team2), matchTime: cricDate(m.matchStartTime)});
  })
  // console.log(upcomingMatches);

  if (doSendWhat === SENDRES) {
    sendok(res, {current: currMatches, upcoming: upcomingMatches});
  } else {
    const socket = app.get("socket");
    socket.emit("currentMatch", currMatches)
    socket.broadcast.emit('curentMatch', currMatches);
    socket.emit("upcomingMatch", upcomingMatches)
    socket.broadcast.emit('upcomingMatch', upcomingMatches);
  }
}

async function sendMatchInfoToClient(res, igroup, doSendWhat) {
  var currTime = new Date();
  //currTime = currTime.setFullYear(currTime.getFullYear()+1);
  console.log(currTime);
  
  let myTournament = await akshuGetTournament(igroup);
  console.log(myTournament);
  
  var currMatches = [];
  let myfilter = { tournament: myTournament.name, matchEnded: false, matchStartTime: { $lt: currTime } };
  let tmp = await CricapiMatch.find(myfilter).sort({ "matchStartTime": 1 });
  tmp.forEach(m => {
    // console.log(m.matchStartTime);
    currMatches.push({team1: cricTeamName(m.team1), team2: cricTeamName(m.team2), matchTime: cricDate(m.matchStartTime)});
  })
  // console.log(currMatches);
  
  // now get upcoming match. Limit it to 5
  const upcomingCount = 5;
  myfilter = { tournament: myTournament.name, matchStartTime: { $gt: currTime } };
  tmp = await CricapiMatch.find(myfilter).limit(upcomingCount).sort({ "matchStartTime": 1 });
  var upcomingMatches = [];
  tmp.forEach(m => {
    // console.log(m.matchStartTime);
    upcomingMatches.push({team1: cricTeamName(m.team1), team2: cricTeamName(m.team2), matchTime: cricDate(m.matchStartTime)});
  })
  // console.log(upcomingMatches);

  if (doSendWhat === SENDRES) {
    sendok(res, {current: currMatches, upcoming: upcomingMatches});
  } else {
    const socket = app.get("socket");
    socket.emit("currentMatch", currMatches)
    socket.broadcast.emit('curentMatch', currMatches);
    socket.emit("upcomingMatch", upcomingMatches)
    socket.broadcast.emit('upcomingMatch', upcomingMatches);
  }
}


async function publish_matches(res, myfilter) {
  // console.log(myfilter);
  var matchlist = await CricapiMatch.find(myfilter);  
  sendok(res, matchlist);
}

async function publish_matches_r0(myfilter) {
  //console.log(myfilter);
    var matchlist = await Match.find(myfilter);
    
    sendok(res, matchlist);
}
 
function calculateScore(mystatrec, type) {
  //console.log(mystatrec);
  var mysum = 0;
  mysum += 
    (mystatrec.run * BonusRun[type]) +
    (mystatrec.four * Bonus4[type]) +
    (mystatrec.six * Bonus6[type]) +
    (mystatrec.wicket * BonusWkt[type]) +
    (mystatrec.maiden * BonusMaiden[type]) +
    ((mystatrec.manOfTheMatch) ? BonusMOM[type] : 0) + 
    ((mystatrec.maxTouramentRun > 0) ? BonusMaxRun[type] : 0) +
    ((mystatrec.maxTouramentWicket > 0) ?  BonusMaxWicket[type] : 0);

	// Bonus for 50, 75, 100 etc. runs
	
	var dataRange = BonusRunRange.find( x => x.matchType === type).range
	for(i=0; i<dataRange.length; ++i) {
		//console.log(dataRange[i].field, dataRange[i].points)
		//console.log(mystatrec[dataRange[i].field],  dataRange[i].points);
		mysum += mystatrec[dataRange[i].field] * dataRange[i].points ;
	}
	//console.log("Stage1: ", mysum);
	
	if (mystatrec.hattrick) {
		mysum += (mystatrec.hattrick * BonusHattrick[type]);
	}
	else {
		var dataRange = BonusWicketRange.find( x => x.matchType === type).range
		for(i=0; i<dataRange.length; ++i) {
			//console.log(dataRange[i].field, dataRange[i].points)
			//console.log(mystatrec[dataRange[i].field],  dataRange[i].points);
			mysum += mystatrec[dataRange[i].field] * dataRange[i].points ;
		}
		//console.log("Stage1: ", mysum);
	}
		

  mysum += 
    (mystatrec.catch * BonusCatch[type]) + 
    (mystatrec.catch3 * BonusCatch3[type]) + 
    (mystatrec.runout * BonusRunOut[type]) + 
    (mystatrec.stumped * BonusStumped[type]);
	//console.log("Stage2: ", mysum);
	
  // now add penalty for duck
  mysum += (mystatrec.duck * BonusDuck[type]);

  // now add for economy
  mysum += (mystatrec.economy * BonusEconomy[type]);
	//console.log("Stage3: ", mysum);
	
  // now add for strike rate
  mysum += (mystatrec.strikeRate * BonusStrikeRate[type]);
	
  console.log("score of "+mystatrec.pid+" is: ", mysum);
  return  mysum
}

async function calculateBrief(tournamentName) {
  let matchStat= mongoose.model(tournamentName, StatSchema);
  let briefStat =  mongoose.model(tournamentName+BRIEFSUFFIX, BriefStatSchema);

  let allMatch = await matchStat.find({});
  let pidList = _.map(allMatch, 'pid');
  pidList = _.uniqBy(pidList);
  //console.log(pidList);
  let allBrief = [];
  pidList.forEach(myPid => {
    let myData = _.filter(allMatch, x => x.pid === myPid);
    if (myData.length !== 0) {
      var mybrief = getBlankBriefRecord(briefStat);
      mybrief.sid = 0;
      mybrief.pid = myPid;
      mybrief.playerName = myData[0].playerName;
      mybrief.score = _.sumBy(myData, x => x.score);
      mybrief.inning = _.sumBy(myData, x => x.inning);
      // batting details
      mybrief.run = _.sumBy(myData, x => x.run);
      mybrief.four = _.sumBy(myData, x => x.four);
      mybrief.six = _.sumBy(myData, x => x.six);
      mybrief.fifty = _.sumBy(myData, x => x.fifty);
      mybrief.run75 = _.sumBy(myData, x => x.run75);
      mybrief.hundred =  _.sumBy(myData, x => x.hundred);
      mybrief.run150 = _.sumBy(myData, x => x.run150);
      mybrief.run200 = _.sumBy(myData, x => x.run200);
      mybrief.strikeRate =  _.sumBy(myData, x => x.strikeRate);
      mybrief.strikeRateValue =  _.sumBy(myData, x => x.strikeRateValue);
      mybrief.ballsPlayed = _.sumBy(myData, x => x.ballsPlayed);

      // bowling details
      mybrief.wicket = _.sumBy(myData, x => x.wicket);
      mybrief.wicket3 = _.sumBy(myData, x => x.wicket3);
      mybrief.wicket4 = _.sumBy(myData, x => x.wicket4);
      mybrief.wicket5 = _.sumBy(myData, x => x.wicket5);
      mybrief.hattrick = _.sumBy(myData, x => x.hattrick);
      mybrief.maiden = _.sumBy(myData, x => x.maiden);
      mybrief.oversBowled = _.sumBy(myData, x => x.oversBowled);
      mybrief.economy = _.sumBy(myData, x => x.economy);
      mybrief.economyValue = _.sumBy(myData, x => x.economyValue);

      // fielding detail
      mybrief.runout = _.sumBy(myData, x => x.runout);
      mybrief.stumped = _.sumBy(myData, x => x.stumped);
      mybrief.bowled = _.sumBy(myData, x => x.bowled);
      mybrief.lbw = _.sumBy(myData, x => x.lbw);
      mybrief.catch = _.sumBy(myData, x => x.catch);
      mybrief.catch3 = _.sumBy(myData, x => x.catch3);
      mybrief.duck = _.sumBy(myData, x => x.duck);

      // overall performance
      mybrief.manOfTheMatch = _.filter(myData, x => x.manOfTheMatch === true).length;
      mybrief.maxTouramentRun = 0;
      mybrief.maxTouramentWicket = 0;
      allBrief.push(mybrief);
    }
  })
  await briefStat.deleteMany({sid: 0});
  allBrief.forEach(x => { x.save(); });
};

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  _group = defaultGroup;
  // _tournament = defaultTournament;
} 

module.exports = router;