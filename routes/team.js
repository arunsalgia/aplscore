const { encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, svrToDbText, getLoginName, getDisplayName, sendCricMail, } = require('./cricspecial'); 
const { 
  cricapi_get_new_tournaments,
  cricapi_get_tournament_squad,
} = require('./cricapifunctions'); 


router = express.Router();
// let TeamRes;


/* GET all users listing. */
router.get('/', function (req, res, next) {
  // TeamRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
}); 


router.use('/squad/:tid', async function(req, res, next) {
  setHeader(res);
  var {tid} = req.params;
  
  //console.log("Hello=============");
  
  let myData = await cricapi_get_tournament_squad(tid);
  console.log(myData);

  let tealList = _.map(myData, o => _.pick(o, ['teamName', 'img']));   //"teamName");
  //console.log(myData);
  
  sendok(res, {tealList: tealList } );
});




router.get('/detail/:myTeam', async function(req, res, next) {
  // TeamRes = res;
  setHeader(res);

  var {myTeam}=req.params;
  myTeam = myTeam.toUpperCase();
  console.log(myTeam);
  var myRec = await Team.findOne({name: myTeam});
  if (myRec) {
	  sendok(res, myRec)
  } else { 
	senderr(res, 601, `Invalid team ${myTeam}`); 
}
 
});
/* GET all users listing. */
router.get('/list', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  console.log("list");
  await publishTeam(res, {}, false);
});

router.get('/tournament/:tournamentName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  console.log("list");
  var {tournamentName} = req.params;
  tournamentName = tournamentName.toUpperCase();	
  await publishTeam(res, {tournament: tournamentName}, false);
});

router.get('/tournamentdelete/:tournamentName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  console.log(`delete tournament ${tournamentName}`);
  var {tournamentName} = req.params;
  await Team.deleteMany({tournament: tournamentName.toUpperCase()});  
  sendok(res, `delete tournament ${tournamentName}`)
});

router.get('/count/tournament/:tournamentName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  var {tournamentName} = req.params;
	tournamentName = tournamentName.toUpperCase()
  let tmp = await Team.find({tournament: tournamentName});  
  sendok(res, {count: tmp.length})
});

router.get('/uniquelist', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  console.log("uniquelist");
  let allTeams = await Team.find({}); 
	allTeams = _.uniqBy(allTeams, 'name');
	allTeams = _.sortBy(allTeams, 'name');
	//console.log(allTeams);
	sendok(res, allTeams);
});

/* GET all users listing. */
router.get('/add/:tournamentName/:teamName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  var {tournamentName, teamName} = req.params;
  
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  let myTeam = await Team.findOne({name: teamName, tournament: tournamentName});
	if (myTeam) return senderr(res, 601, "Duplicate team name");
	
	myrec = new Team();
	myrec.name = teamName;
	myrec.fullname = teamName;
	myrec.tournament = tournamentName;
	myrec.save();  

  sendok(res, myrec);
});


router.get('/delete/:tournamentName/:teamName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  var {tournamentName, teamName} = req.params;
  
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
  await Team.deleteOne({name: teamName, tournament: tournamentName});
  sendok(res, "deleted team");
});


router.get('/update/:tournamentName/:oldTeamName/:teamName', async function (req, res, next) {
  // TeamRes = res;
  setHeader(res);  
  var {tournamentName, oldTeamName, teamName} = req.params;
  
  tournamentName = tournamentName.toUpperCase();
  teamName = teamName.toUpperCase();
	oldTeamName = oldTeamName.toUpperCase();
	
  let myTeam = await Team.findOne({name: teamName, tournament: tournamentName});
	if (myTeam) return senderr(res, 601, "Duplicate team name");
	
	myTeam = await Team.findOne({name: oldTeamName, tournament: tournamentName});
	if (!myTeam) return senderr(res, 602, "Original team not found");
	
	myTeam.name = teamName;
	myTeam.fullname = teamName;
	myTeam.tournament = tournamentName;
	myTeam.save();  

  sendok(res, myTeam);
});

async function publishTeam(res, filter_teams, setUnique) {
  var ulist = await Team.find(filter_teams).sort({'name': 1});
  //ulist = _.map(ulist, o => _.pick(o, ['name']));
  //if (setUnique)
	//ulist = _.uniqBy(ulist, x => x.name);
  //ulist = _.sortBy(ulist, 'name');
  sendok(res, ulist);
}


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  _group = defaultGroup;
  _tournament = defaultTournament;
}
module.exports = router;

