var router = express.Router();
// let TournamentRes;

const { 
  cricapi_get_new_tournaments,
} = require('./cricapifunctions'); 

/* GET users listing. */
router.use('/', function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

  if (req.url == '/') 
    publishTournament(res, {});
  else
    next('route');
}); 

router.use('/info/:tournamentName', function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

  var {tournamentName} = req.params;
  tournamentName = tournamentName.toUpperCase();
  publishTournament(res, {name: tournamentName});
});

router.use('/newtournaments', async function(req, res, next) {
  setHeader(res);
 
  console.log("Hello=============");
  
  let myData = await cricapi_get_new_tournaments();
  //console.log(myData);
  
  sendok(res, {newTouraments: myData } );
});

router.get('/allfilter/:partTournamentName', async function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  
  let {partTournamentName}=req.params;
  partTournamentName = partTournamentName.toUpperCase();
  let plist = await Tournament.find({} );
  //console.log(plist);
  if (partTournamentName !== "ALL") {
	plist = plist.filter(x => x.name.toUpperCase().includes(partTournamentName));
  }
  plist = _.sortBy(plist, 'name');
  sendok(res, plist)
});

router.get(`/list/running`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: true, over: false});
});

router.get(`/list`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: true});
});


router.get(`/list/notstarted`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: true, started: false});
});

router.get(`/list/over`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: true, over: true});
});

router.get(`/list/enabled`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: true});
});

router.get(`/list/disabled`, function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  publishTournament(res, {enabled: false});
});


updateTournamentMaxRunWicket = async function(tournamentName) {
  //--- start
  // ------------ Assuming tournament as over
  let tournamentStat = mongoose.model(tournamentName, StatSchema);
  let BriefStat = mongoose.model(tournamentName+BRIEFSUFFIX, BriefStatSchema);

  let tdata = await BriefStat.find({});
  let tmp = _.filter(tdata, x => x.sid === MaxRunMid);
  if (tmp.length > 0) return true;    // max run already assigned. Assuming same done for max wicket

  tmp = _.filter(tdata, x => x.sid == MaxWicketMid);
  if (tmp.length > 0) return true;

  let pidList = _.map(tdata, 'pid');
  pidList = _.uniqBy(pidList);

  // calculate total runs and total wickets of each player (played in tournament matches)
  let sumList = [];
  pidList.forEach( mypid => {
    tmp = _.filter(tdata, x => x.pid === mypid);
    if (tmp.length > 0) {
      var iRun = _.sumBy(tmp, 'run');
      var iWicket = _.sumBy(tmp, 'wicket');
      sumList.push({pid: mypid, playerName: tmp[0].playerName, totalRun: iRun, totalWicket: iWicket});
    }
  });

  // now get list of players who have score max runs (note there can be more than 1)
  tmp = _.maxBy(sumList, x => x.totalRun);
  //console.log(tmp);
  let maxList = _.filter(sumList, x => x.totalRun == tmp.totalRun);
  let bonusAmount  = BonusMaxRun["TEST"] / maxList.length;
  maxList.forEach( mmm => {
    let myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxRunMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentRun = mmm.totalRun;  
    myrec.save(); 

    let mybrief = getBlankBriefRecord(BriefStat);
    mybrief.sid = MaxRunMid;
    mybrief.pid = mmm.pid;
    mybrief.playerName = mmm.playerName;
    mybrief.score = bonusAmount;
    mybrief.maxTouramentRun = mmm.totalRun;  
    mybrief.save(); 
  });

  // now get list of players who have taken max wickets (note there can be more than 1)
  tmp = _.maxBy(sumList, x => x.totalWicket);
  //console.log(tmp);
  maxList = _.filter(sumList, x => x.totalWicket == tmp.totalWicket);
  bonusAmount  = BonusMaxWicket["TEST"] / maxList.length;
  maxList.forEach( mmm => {
    let myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxWicketMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentWicket = mmm.totalWicket;
    myrec.save(); 

    let mybrief = getBlankBriefRecord(BriefStat);
    mybrief.sid = MaxWicketMid;
    mybrief.pid = mmm.pid;
    mybrief.playerName = mmm.playerName;
    mybrief.score = bonusAmount;
    mybrief.maxTouramentWicket = mmm.totalWicket;  
    mybrief.save(); 
  });

  // all done
  return true;
}



router.get(`/statusupdate/:tournamentName`, async function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  var {tournamentName} = req.params;

  /* 
    update if tournament started / over flag
    1) Get tournament record.
    2) Get matches
    3) If no matches  started is FALSE and over is FALSE 
    4) if 1st match time < current time then started is TRUE 
    5) if last match end time < current time then over is true;
  */
  var tournamentRec = await Tournament.findOne({name: tournamentName});
  if (tournamentRec) {
    tournamentRec.started = false;
    tournamentRec.over = false;
    var myMatches = await CricapiMatch.find({tournament: tournamentName});
    if (myMatches.length > 0) {
      // if matche details are available then
      // console.log(myMatches);
      var currTime = new Date();
      // console.log(currTime);
      var matchTime = _.minBy(myMatches, 'matchStartTime') 
      // console.log(matchTime.matchStartTime);
      tournamentRec.started = (matchTime.matchStartTime < currTime);
      var matchTime = _.maxBy(myMatches, 'matchEndTime');
      // console.log(matchTime.matchEndTime);
      tournamentRec.over = (matchTime.matchEndTime < currTime);
    }
    // console.log(tournamentRec);
    tournamentRec.save();
    sendok(res, "OK");
  } else
    senderr(res, 741, `Invalid tournament name ${tournamentName}`);
});

router.get('/add/:tournamentName/:tournamentDesc/:tournamentType/:tournamentId', async function(req, res, next) {
    // TournamentRes = res;
    setHeader(res);
    if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

    var {tournamentName, tournamentDesc, tournamentType, tournamentId} = req.params;
    tournamentType = tournamentType.toUpperCase();
    if (!["TEST", "ODI", "T20"].includes(tournamentType)) {
      senderr(res, 743, `Invalid tournament type ${tournamentType}. Has be be either TEST, ODI or T20`);
      return;
    }
    tournamentName = tournamentName.toUpperCase();
    var myrec = await Tournament.findOne({name: tournamentName});
    if (!myrec) {
        myrec = new Tournament();
        myrec.name = tournamentName;
        myrec.desc = tournamentDesc;
        myrec.type = tournamentType;
				myrec.started = false;
        myrec.seriesId = tournamentId;
        myrec.over = false;
				myrec.enabled = true;
        myrec.save();
        sendok(res, myrec);
    } else
        senderr(res, 742,`Tournament ${tournamentName} already exists`);
});


router.get('/update/:tournamentName/:tournamentDesc/:tournamentType', async function(req, res, next) {
    // TournamentRes = res;
    setHeader(res);
    if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

    var {tournamentName, tournamentDesc, tournamentType} = req.params;
    tournamentType = tournamentType.toUpperCase();
    if (!["TEST", "ODI", "T20"].includes(tournamentType)) {
      senderr(res, 743, `Invalid tournament type ${tournamentType}. Has be be either TEST, ODI or T20`);
      return;
    }
    tournamentName = tournamentName.toUpperCase();
    var myrec = await Tournament.findOne({name: tournamentName});
    if (!myrec) {
        myrec = new Tournament();
        myrec.name = tournamentName;
		myrec.started = false;
        myrec.over = false;
		myrec.enabled = true;
    } 
	myrec.desc = tournamentDesc;
	myrec.type = tournamentType;
	myrec.save();
	sendok(res, myrec);
});

router.get('/delete/:tournamentName', async function(req, res, next) {
	// TournamentRes = res;
	setHeader(res);
	if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

	var {tournamentName} = req.params;
	tournamentName = tournamentName.toUpperCase();
  await Tournament.deleteOne({name: tournamentName}) 
  sendok(res, "Deleted");
});


router.use('/start/:tournamentName', function(req, res, next) {
    // TournamentRes = res;
    setHeader(res);
    if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

    var {tournamentName} = req.params;
    sendTournamentStatus(tournamentName, false);
});

router.use('/end/:tournamentName', function(req, res, next) {
    // TournamentRes = res;
    setHeader(res);
    if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

    var {tournamentName} = req.params;
    sendTournamentStatus(tournamentName, true);
});

router.use('/team/:tournamentName', function(req, res, next) {
    // TournamentRes = res;
    setHeader(res);
    if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

    var {tournamentName} = req.params;
    tournamentName = tournamentName.toUpperCase();
    publish_teams(res, {tournament: tournamentName});
});

async function getMatchDetails(tournamentName) {
  let allMatches = await CricapiMatch.find({tournament: tournamentName});
  // allMatches =  _.map(allMatches, o => _.pick(o, ['team1', 'team2', 'matchStartTime']));
  allMatches = _.sortBy(allMatches, 'matchStartTime');
  let myData=[]
  await allMatches.forEach(m => {
    myData.push({team1: m.team1, team2: m.team2, matchStartTime: cricDate(m.matchStartTime)});
  });
  return myData;
}


router.get('/tournament', async function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  
  let startTime = new Date();
  startTime.setDate(startTime.getDate()-90);
  // console.log(startTime);

  //CricapiMatch.find({tournament: groupRec.tournament}).limit(1).sort({ "matchStartTime": 1 });
  let allTournament = await Tournament.find({enabled: true});
  let matchesOfTournament=[];
  for(i=0; i<allTournament.length; ++i) {
    let tournamentStatus = "";
    if (allTournament[i].started) {
      if (allTournament[i].over)
        tournamentStatus = "Complete";
      else
        tournamentStatus = "Running";
    } else
      tournamentStatus = "Upcoming"
    let firstMatch = await CricapiMatch.find({tournament: allTournament[i].name}).limit(1).sort({ "matchStartTime": 1 });
    // if (allTournament[i].name === "IPL2020") console.log(firstMatch);
    if (firstMatch.length > 0) {
      let diffTime = firstMatch[0].matchStartTime.getTime() - startTime.getTime();
      if (diffTime > 0) {
        let myMatches = await getMatchDetails(allTournament[i].name);
        matchesOfTournament.push({tournament: allTournament[i].name, 
          type: allTournament[i].type,
          status: tournamentStatus, 
          startTime: firstMatch[0].matchStartTime, 
          matches: myMatches})
      }
    }
  }
  matchesOfTournament = _.sortBy(matchesOfTournament, 'startTime');
  sendok(res, matchesOfTournament);
});

router.get('/arun/:tournamentName', async function(req, res, next) {
  // TournamentRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }

  var {tournamentName} = req.params;

  let myTournament = await Tournament.findOne({name: tournamentName})
  if (!myTournament) { senderr(res, 601, "Invalid tournament"); return; };
  checkTournamentOver(tournamentName);
  sendok(res, "Checking done");
});

async function sendTournamentStatus(tname, started)
{
    tname = tname.toUpperCase();
    var mytournament = await Tournament.findOne({name: tname});
    if (!mytournament) {
        senderr(res, 741, `Invalid tournament name ${tname}`);
        return;
    }
    mytournament.over = started;
    mytournament.save();
    var retsts;
    if (!started)   retsts = `Tournament ${tname} is going on`;
    else            retsts = `Tournament ${tname} has ended`;
    sendok(res, retsts);
}

async function publishTournament(res, filter_tournament)
{
  var tlist = await Tournament.find(filter_tournament);
  // tlist = _.map(tlist, o => _.pick(o, ['name', 'desc', 'type', 'over']));
  tlist = _.sortBy(tlist, 'name');
  sendok(res, tlist);
}


async function publish_teams(res, filter_teams)
{
  var tlist = await Team.find(filter_teams);
  tlist = _.map(tlist, o => _.pick(o, ['name', 'fullname', 'tournament']));
  sendok(res, tlist);
}

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
