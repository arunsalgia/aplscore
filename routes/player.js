router = express.Router();
const { 
  cricapi_get_new_tournaments,
  cricapi_get_tournament_squad,
  cricapi_find_palyers,
} = require('./cricapifunctions'); 

// var PlayerRes;

/* GET users listing. */
router.use('/', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return};
  next('route');
});

// search players in cricdata
router.get('/search/:strstr', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {strstr}=req.params;
  
  var myData = await cricapi_find_palyers(strstr);
  myData = _.sortBy(myData, 'name');
  sendok(res, myData);
});

router.get('/list', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  await publish_players(res, {}); 
});
const oldName = ["CSK", "KKR", "RCB", "SRH", "MI", "RR", "DC", "KXIP"]
const NewName = ["CHENNAI SUPER KINGS", "KOLKATA KNIGHT RIDERS", 
				"ROYAL CHALLENGERS BANGALORE", "SUNRISERS HYDERABAD", 
				"MUMBAI INDIANS", "RAJASTHAN ROYALS", 
				"DELHI CAPITALS", "KINGS XI PUNJAB"]
//const oldName = ["KXIP"]
let numList = [0, 0, 0, 0, 0, 0, 0, 0];
router.get('/namechange', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  let num = 0;
  let tot = 0;
  console.log(numList.length);
  for(var i=0; i<8; ++i) {
	  numList[i] = 0;
  }
  let plist = await Player.find({});
  plist.forEach(p => {
	 let idx = oldName.indexOf(p.Team);
	 if (idx >= 0) {
		 ++numList[idx]
		 ++tot;
		 p.Team = NewName[idx];
		 p.save();
	 } else {
		if (p.tournament === "IPL2020") {
			console.log(p);
		}
	}
  });
  console.log(tot);
  sendok(res, numList);
});

router.get('/cricapi/:tournamentId', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentId}=req.params;
  
  console.log("============= cricapl start");
  console.log(tournamentId);
  let myData = await cricapi_get_tournament_squad(tournamentId);
  let allPlayers=[];
  let teamPlayers=[];
  let myIdx = 0;
  for(var tidx=0; tidx<myData.length; ++tidx) {
    for(var pidx=0; pidx < myData[tidx].players.length; ++pidx) {
      allPlayers.push(myData[tidx].players[pidx]);
      allPlayers[myIdx++]["teamName"] = myData[tidx].teamName;
      //console.log(myData[tidx].teamName);
      //teamPlayers.push(myData[tidx].teamName);
    }
  }
  console.log("============= cricapl ends");
  allPlayers = _.sortBy(allPlayers, 'name');
  sendok(res, {players: allPlayers} );
 
});


router.get('/detail/:myPid', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {myPid}=req.params;
  console.log(myPid);
  var myRec = await Player.findOne({pid: myPid});
  if (myRec) {
	  sendok(res, myRec)
  } else { 
	senderr(res, 601, `Invalid Player id ${myPid}`); 
}
 
});

// get list of all players as per group
router.get('/group/:groupid', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {groupid}=req.params;
  console.log(groupid);
  var myGroup = await IPLGroup.findOne({gid: groupid});
  if (myGroup) {
	  await publish_players(res, { tournament: myGroup.tournament } );
  } else { 
	senderr(res, 682, `Invalid Group ${groupid}`); 
}
 
});

router.get('/tournament/:tournamentName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentName}=req.params;
  await publish_players(res, { tournament: tournamentName } );
});

router.get('/auction/:tournamentName/:teamName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentName, teamName}=req.params;
	tournamentName = tournamentName.toUpperCase();
	teamName = teamName.toUpperCase();
	//console.log(teamName);
  
	// first get all the group which have subscribed to the given tournament
	let allRecs = await IPLGroup.find({tournament: tournamentName}, {gid: 1, _id: 0});
	//console.log(allRecs);
	let myGroups = _.map(allRecs, 'gid');
	//console.log(myGroups);
	
	// now get all player id of the group auction (for the given team)
	allRecs = await Auction.find({team: teamName, gid: {$in: myGroups}}, {pid: 1, _id: 0});
	//console.log(allRecs);
	let allPids = _.map(allRecs, 'pid');
	allPids = _.uniqBy(allPids);
	//console.log(allPids);
	
  await publish_players(res, { tournament: tournamentName, Team: teamName, pid: {$in: allPids} } );
});

router.get('/tteam/:tournamentName/:teamName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentName, teamName}=req.params;
	tournamentName = tournamentName.toUpperCase();
	teamName = teamName.toUpperCase();
	console.log("PlayerCount: " + teamName.length);
  await publish_players(res, { tournament: tournamentName, Team: teamName } );
});

router.get('/team/count/:tournamentName/:teamName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentName, teamName}=req.params;
	tournamentName = tournamentName.toUpperCase();
	teamName = teamName.toUpperCase();
	console.log(tournamentName, teamName);
	let tmp = await Player.find({ tournament: tournamentName, Team: teamName });
	console.log(tmp);
  sendok(res, {count: tmp.length});
});


router.get('/teamfilter/:tournamentName/:teamName/:partPlayerName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  let {tournamentName, teamName, partPlayerName}=req.params;
  partPlayerName = partPlayerName.toUpperCase();
  let plist = await Player.find({ tournament: tournamentName, Team: teamName } );
  //console.log(plist);
  plist = plist.filter(x => x.name.toUpperCase().includes(partPlayerName));
  plist = _.sortBy(plist, 'name');
  //console.log(plist);
  sendok(res, plist)
});

router.get('/allfilter/:partPlayerName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  let {partPlayerName}=req.params;
  partPlayerName = partPlayerName.toUpperCase();
  let plist = await Player.find({} );
  //console.log(plist);
  plist = plist.filter(x => x.name.toUpperCase().includes(partPlayerName));
  plist = _.uniqBy(plist, 'pid');
  plist = _.sortBy(plist, 'name');
  //console.log(plist);
  sendok(res, plist)
});
 

// delete all the players of the team (of given tournament)
router.get('/add/:pid/:name/:tournamentName/:teamName/:role/:batStyle/:bowlStyle', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {pid, name, tournamentName, teamName, 
      role, batStyle, bowlStyle
    }=req.params;
  console.log(name);
  console.log(tournamentName);
  console.log(teamName);
  console.log(role);
  console.log(batStyle);
  console.log(bowlStyle);
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  let pRec = await Player.findOne({pid: pid, tournament: tournamentName, Team: teamName});
	if (pRec) return senderr(res, 601, "Duplicate player");
	

	console.log("New Player");
	pRec = new Player();
	pRec.pid = pid;
	pRec.tournament = tournamentName;
	pRec.Team = teamName;

  console.log(pRec);
  pRec.name = name;
  pRec.fullName = name;
  pRec.role = role;
  pRec.battingStyle = batStyle;
  pRec.bowlingStyle = bowlStyle;
  pRec.save();
  sendok(res, pRec);
});

// delete all the players of the team (of given tournament)
router.get('/add/:pid/:name/:tournamentName/:teamName/:role/:batStyle/:bowlStyle/:cricPid', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {pid, name, tournamentName, teamName, 
      role, batStyle, bowlStyle,
      cricPid,
    }=req.params;
  console.log(name);
  console.log(tournamentName);
  console.log(teamName);
  console.log(role);
  console.log(batStyle);
  console.log(bowlStyle);
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  let pRec = await Player.findOne({pid: pid, tournament: tournamentName, Team: teamName});
	if (pRec) return senderr(res, 601, "Duplicate player");
	

	console.log("New Player");
	pRec = new Player();
	pRec.pid = pid;
	pRec.tournament = tournamentName;
	pRec.Team = teamName;

  console.log(pRec);
  pRec.name = name;
  pRec.fullName = name;
  pRec.role = role;
  pRec.battingStyle = batStyle;
  pRec.bowlingStyle = bowlStyle;
  pRec.cricPid =  cricPid;
  pRec.save();
  sendok(res, pRec);
});

router.get('/update/:pid/:name/:tournamentName/:teamName/:role/:batStyle/:bowlStyle', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {pid, name, tournamentName, teamName, 
      role, batStyle, bowlStyle
    }=req.params;
  console.log(name);
  console.log(tournamentName);
  console.log(teamName);
  console.log(role);
  console.log(batStyle);
  console.log(bowlStyle);
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  let pRec = await Player.findOne({pid: pid, tournament: tournamentName, Team: teamName});
	if (!pRec) return senderr(res, 601, "player not found");
	
	console.log("Update Player");
  pRec.name = name;
  pRec.fullName = name;
  pRec.role = role;
  pRec.battingStyle = batStyle;
  pRec.bowlingStyle = bowlStyle;
  pRec.save();
  sendok(res, pRec);
});

// delete all the players of the team (of given tournament)
router.get('/teamdelete/:tournamentName/:teamName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {tournamentName, teamName}=req.params;
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  
  await Player.deleteMany({tournament: tournamentName, Team: teamName});
  //let plist = await Player.find({tournament: tournamentName, Team: teamName} );
  //console.log(plist);
  sendok(res, "delete players done");
});

router.get('/delete/:pid/:tournamentName/:teamName', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {pid, tournamentName, teamName}=req.params;
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  
  await Player.deleteOne({pid: pid, tournament: tournamentName, Team: teamName});
  sendok(res, "delete player done");
});

router.get('/uniquelist', async function(req, res, next) {
  setHeader(res);

  var allPlayer = await Player.find({}).sort({name: 1});
	allPlayer = _.uniqBy(allPlayer, 'pid');
	allPlayer = _.sortBy(allPlayer, 'name');
	//console.log(allPlayer)
	sendok(res, allPlayer);
});

router.get('/cricdatauniquelist', async function(req, res, next) {
  setHeader(res);

  var allPlayer = await Player.find({cricPid: /-/}).sort({name: 1});
	allPlayer = _.uniqBy(allPlayer, 'pid');
	allPlayer = _.sortBy(allPlayer, 'name');
	//console.log(allPlayer)
	sendok(res, allPlayer);
});


// get list of purchased		 players
router.get('/sold', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  //var {groupid}=req.params;
  var groupid = "1";
  if (isNaN(groupid)) { senderr(res, 682, `Invalid Group ${groupid}`); return; }
  var igroup = parseInt(groupid);
  var myGroup = await IPLGroup.findOne({gid: igroup});
  if (!myGroup) { senderr(res, 682, `Invalid Group ${groupid}`); return; }

  var alist = await Auction.find({gid: igroup});
  var mypid = _.map(alist, 'pid');
  publish_players(res, { tournament: myGroup.tournament, pid: { $in: mypid } } );
});

// get list of players not purchased (only 1 group)
router.get('/unsold', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  //var {groupid}=req.params;
  var groupid = "1";
  if (isNaN(groupid)) { senderr(res, 682, `Invalid Group ${groupid}`); return; }
  var igroup = parseInt(groupid);
  var myGroup = await IPLGroup.findOne({gid: igroup});
  if (!myGroup) { senderr(res, 682, `Invalid Group ${groupid}`); return; }

  var soldplayers = await Auction.find({gid: igroup});
  var soldpid = _.map(soldplayers, 'pid');

  publish_players(res, {tournament: myGroup.tournament,  pid: { $nin: soldpid } } );
});


router.get('/updateauction', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  //var {groupid}=req.params;
  var auctionList = await Auction.find({gid: 1});
  var playerList = await Player.find({tournament: "IPL2020"});
  auctionList.forEach( a => {
    playerRec = _.find(playerList, x => x.pid === a.pid);
    a.team = playerRec.Team;
    a.save();
  });
  sendok(res, "OK");
});




router.get('/available/:playerid', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);

  var {playerid}=req.params;
  var groupid = "1";
  if (isNan(groupid)) { senderr(res, 682, `Invalid Group ${groupid}`); return; }
  if (isNaN(playerid)) { senderr(res, 681, `Invalid player id ${playerid}`); return; }
  var igroup = parseInt(groupid);
  var iplayer = parseInt(playerid);
  
  //  first confirm player id is correct
  var playerRec = await Auction.findOne({gid: igroup, pid: iplayer});
  sendok(res, playerRec === null);
});


router.get('/setkey/:myPid/:myKey', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  var {myPid, myKey}=req.params;
  console.log(myPid);
  var myRec = await IdMapping.findOne({key: myKey});
  if (!myRec) {
	  myRec = new IdMapping();
  } 
	myRec.id = myPid;
	myRec.key = myKey;
	myRec.save();
	sendok(res, myRec); 
});

router.get('/test', async function(req, res, next) {
  // PlayerRes = res;
  setHeader(res);
  
	let tmp = await Player.find({ role: /Allrounder/ });
	for(let i=0; i<tmp.length; ++i) {
		tmp[i].role = "AllRounder";
		await tmp[i].save();
	}
	console.log(tmp);
  sendok(res, {count: tmp.length});
});

async function publish_players(res, filter_players)
{
	//console.log("About to publish");
  //console.log(filter_players);
  var plist = await Player.find(filter_players).sort({'name': 1});
  //console.log("Players count", plist);
  //plist = _.sortBy(plist, 'name');
  sendok(res, plist);
}

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errocode, errmsg) { res.status(errocode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
