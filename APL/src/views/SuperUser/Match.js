import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar"
import { useAlert } from 'react-alert'
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import globalStyles from "assets/globalStyles";
import sortBy from "lodash/sortBy";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName, disablePastDt } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
import {red, blue, deepOrange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

import {
HOURSTR, MINUTESTR, MONTHNUMBERSTR, DATESTR,
} from "views/globals";

const useStyles = makeStyles((theme) => ({
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
	}, 
	title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700],
		paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4), 
	},
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	allAppt: {
		backgroundColor: blue[100],
	},
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
        color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },    
    messageText: {
          color: '#4CC417',
          fontSize: 12,
          // backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
        margin: theme.spacing(0, 1, 0),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));


export default function Match() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [teamFound, setNewTournament] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentType, setTournamentType] = useState("T20");
  const [tournamentDesc, setTournamentDesc] = useState("");
  const [tournamentSeriesId, setTournamentSeriesId] = useState("");
  const [teamName, setTeamName] = useState("");
	const [newTeamName, setNewTeamName] = useState("");
	const [teamList, setTeamList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [newMatchList, setNewMatchList] = useState([]);
  const [matchName, setMatchName] = useState("");
	
  const [registerStatus, setRegisterStatus] = useState(0);
  const [labelNumber, setLabelNumber] = useState(0);
  const [newTeamList, setNewTeamList] = useState([]);

	const [mid, setMid] = useState(0);
	const [team1, setTeam1] = useState("");
	const [team2, setTeam2] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [startTime, setStartTime] = useState(new Date());
	const [cricApiId, setCricApiId] = useState("");
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
		const tournament = async () => {
			try {
				let tRec = JSON.parse(sessionStorage.getItem("shareTournament"));
				setTournamentName(tRec.name);
				setTournamentDesc(tRec.desc);
				setTournamentType(tRec.type);
        setTournamentSeriesId(tRec.cricTid);
				localStorage.setItem('MatchType', tRec.type);
				getAllTeams(tRec.name);
				getAllMatches(tRec.name);
			} catch (e) {
				alert.error("Tournament name not specified");
			}
		}
		//a();
		tournament();
  }, [])

	async function getAllTeams(tName) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/tournament/${tName}`);
			 setTeamList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching team list of "+tName);
			setTeamList([]);
		}
	}
	
	async function getAllMatches(tName) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/list/tournament/${tName}`);
			 setMatchList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching match list of "+tName);
			setMatchList([]);
		}
	}
	
	
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
  function ShowTeamImage(props) {
    let myTeam = getImageName(props.teamName);
    return(
    <Avatar variant="square" src={getImageName(props.teamName)} className={classes.medium} />    
    )
  } 

  function handleSwitch(t) {
    let clone  = [].concat(newTeamList);
    // console.log(t);
    let tmp = clone.find(x => x.label === t);
    tmp.existingTeam = (tmp.existingTeam) ? false : true;
    // console.log(clone);
    setNewTeamList(clone);
  }

  function handlePlayerSelect(label, newName) {
    // console.log(`${label}  ${newName}`)
    if (newName === "") {
      setRegisterStatus(1001);
      return;
    } 
    let clone = [].concat(newTeamList);
    let tmp = clone.find(x => x.name === newName);
    if ((tmp) && (tmp.label !== label)) {
      setRegisterStatus(1002);
    } else {
      setRegisterStatus(0);
    }
    tmp = clone.find(x => x.label === label);
    tmp.name = newName;
    setNewTeamList(clone);
  }

  function handlePlayerValidator(label, newName) {
    // console.log(`${label}  ${newName}`)
    let clone = [].concat(newTeamList);
    let tmp = clone.find(x => x.label === label);
    tmp.name = newName.toUpper();
    setNewTeamList(clone);
  }

  function oldsetTeamName(label) {
    //console.log(`${label}`);
    let chkstr = document.getElementById(`LABEL_${label}`).value.toUpperCase();
    //setfilterString(chkstr);
    if (chkstr.length === 0) {
      setRegisterStatus(1001);
      return;
    }
    //console.log(chkstr);
    let clone = [].concat(newTeamList);
    let tmp = clone.find(x => x.name === chkstr);
    if ((tmp) && (tmp.label !== label)) {
      setRegisterStatus(1002);
      return;
    }
    tmp = clone.find(x => x.label === label);
    tmp.name = chkstr;
    setNewTeamList(clone);
    setRegisterStatus(0);
  }

  function GetTeam(props) {
    // console.log("Get Team");
    let myLabel=`LABEL_${props.myTeam.label}`;
    if (props.myTeam.existingTeam) {
      // let tmp = teamList.find(x => x.name === props.myTeam.name)
      // if (!tmp) props.myTeam.name = "";
      return(
        <Select labelId='team' id='team'
        variant="outlined"
        required
        fullWidth
        label="Team"
        name="Team"
        id="Team"
        value={props.myTeam.name}
        //displayEmpty 
        onChange={(event) => handlePlayerSelect(props.myTeam.label, event.target.value)}
        >
        {teamList.map(x =>
        <MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
      </Select>
      )      
    } else {
      return (
      //   <TextValidator
      //   key={props.myTeam.label}
      //   variant="outlined"
      //   required
      //   fullWidth      
      //   label="Team Name"
      //   onChange={(event) => handlePlayerSelect(props.myTeam.label, event.target.value)}
      //   name="teamname"
      //   // type=""
      //   value={props.myTeam.name}
      // />
      <div className={classes.filter} align="center">
      <TextField className={classes.filter} 
        variant="outlined"
        id={myLabel} margin="none" size="small" defaultValue={props.myTeam.name}/>        
      <Button key="filterbtn" variant="contained" color="primary" size="small"
        className={classes.button} onClick={(event) => setTeamName(props.myTeam.label)}>Submit
      </Button>
      </div>
      )
    }
  }

  function handleDelete(t) {
    let clone = newTeamList.filter(x => x.label !== t);
    setNewTeamList(clone);
  }

  function TeamDetails(props) {
  // console.log(props.myTeam.existingTeam);
  return (
      <div key="TeamInfo">
        <Card profile>                    
          <CardBody profile>
          <Typography component="div">New Team
          <Switch 
            color="primary"
            checked={props.myTeam.existingTeam} 
            onClick={() => handleSwitch(props.myTeam.label)}
          />
          Existing Team
          </Typography>
          <GetTeam myTeam={props.myTeam} />
          <ShowResisterStatus  />
          <Button variant="contained" color="primary" size="small"
            onClick={() => { handleDelete(props.myTeam.label) }}
            className={classes.button}>Delete
          </Button>
          </CardBody>
        </Card>
      </div>
  )}

  function DisplayTeam() {
    return (newTeamList.map(team =>
    <Accordion expanded={expandedPanel === team.label} onChange={handleAccordionChange(team.label)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Grid container justify="center" alignItems="center" >
            <GridItem xs={9} sm={9} md={9} lg={9} >
            <Typography className={classes.heading}>{team.name}</Typography>
            </GridItem>
            <GridItem xs={3} sm={3} md={3} lg={3} >
              <ShowTeamImage teamName={team.name} />
            </GridItem>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <TeamDetails myTeam={team} />
      </AccordionDetails>
    </Accordion>
    ));
  }
  
      
  async function handleSubmit() {
    let tmp;
    console.log("Submit Clicked");
    let errCode = 0;
    if (tournamentName.length === 0) {
      setRegisterStatus(2001);
      return;
    }
    if (tournamentType.length === 0) {
      setRegisterStatus(2002);
      return;
    } 
    if (newTeamList.length <= 1) {
      setRegisterStatus(2003);
      return;
    } 
    tmp = newTeamList.filter(x => x.name === "");
    if (tmp.length > 0) {
      setRegisterStatus(2004);
      return;
    } 
    let i;
    for (i=0; i<newTeamList.length; ++i) {
      let  tmp = newTeamList.find(x => x.name === newTeamList[i].name);
      if (tmp.length > 1) {
        setRegisterStatus(2005);
        return;
      }
    }
    try {
      // add tournament
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/update/${tournamentName}/${tournamentDesc}/${tournamentType}`);
    } catch {
      setRegisterStatus(2006);  // duplicate tournament name
      return;
    }
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/tournamentdelete/${tournamentName}`);
      // add all teams 1 by 1 
      let i;
      for(i=0; i<newTeamList.length; ++i) {
        let tm = newTeamList[i];
        //console.log(`Now setting team ${tm.name}`)
        await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/add/${tournamentName}/${tm.name}`);
        //console.log(`done team ${tm.name}`)
      };
      setRegisterStatus(2000);  
    } catch {
      setRegisterStatus(2007);
    }
    console.log(`All done `)
  }

  function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = 'Team name cannot be blank';
        break;
      case 1002:
        myMsg = 'Dupliacte Team name';
        break;
      case 2000:
        myMsg = 'Successfully updated Tournament with teams.';
        errmsg = false;
        break;
      case 2001:
        myMsg = 'Tournament name cannot be blank';
        break;
      case 2002:
        myMsg = 'Tournament Type cannot be blank';
        break;
      case 2003:
        myMsg = 'Minimum 2 teams required for tournament';
        break;
      case 2004:
        myMsg = 'Team name cannot be blank';
        break;
      case 2005:
        myMsg = 'DUplicate Team name';
        break;
      case 2006:
        myMsg = 'DUplicate Tournamenet name';
        break;
      case 2007:
        myMsg = 'Error updating team name';
        break;
      case 0:
        myMsg = ``;
        errmsg = false;
        break;      
      default:
        myMsg = `Unknown error code ${registerStatus}`;
        break;
    }
    let myClass = (errmsg) ? classes.error : classes.root;
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }


  function handleAddNewTeam() {
    let clone = [].concat(newTeamList);  
    let tmp = {label: "", existingTeam: true, name: ""}
    tmp.label = getNewTeamLabel();
    clone.push(tmp);
    setNewTeamList(clone);
  }

  
  async function handleTournament() {
    console.log("get tournament");
    if (tournamentName.length === 0) return;
    try {
      // let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/player/tteam/${tournamentName}/${currTeam}`
      let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/info/${tournamentName}`
      let resp = await axios.get(myURL);
      let tmp = resp.data;
      if (tmp.length === 0) {
        setTournamentName("");
        setTournamentDesc("");
        setTournamentType("");
        setNewTeamList([]);
        return;
      }
      setTournamentDesc(tmp[0].desc);
      setTournamentType(tmp[0].type);

      // not get all the teams
      myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/team/tournament/${tournamentName}`
      resp = await axios.get(myURL);
      let clone = [];  
      let newNum = labelNumber + 1;
      var i;
      for(i=0; i<resp.data.length; ++i) {
        clone.push({label: `TEAM${newNum}`, existingTeam: true, name: resp.data[i].name});
        ++newNum;
      }
      setLabelNumber(newNum);
      setNewTeamList(clone);
      //console.log(clone);
    } catch(e) {
      console.log("In error")
    }
  }

  async function handleFilter(label) {
    setNewTeamList([]);
    let chkstr = document.getElementById(label).value.toUpperCase();
    console.log(chkstr);
    //if (chkstr.length > 0) {
    if (chkstr.length === 0) {
      chkstr = "ALL";
    }
    console.log(chkstr);
    let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/allfilter/${chkstr}`);
    console.log(resp.data);
    setTournamentList(resp.data);
    setTournamentName("");
    setTournamentDesc("");
      //setMatchList([]);
      // if (resp.data.length > 0) {
      //   setFilterPlayerName(resp.data[0].name);
      // }
    // } else {
    //   setFilterPlayerList([]);
    // }      
  }

	async function addNewTournament() {
		try {
      // add tournament
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/add/${tournamentName}/${tournamentName}/${tournamentType}`);
			alert.show("Successfully added tournamenet "+tournamentName);
    } catch {
			alert.error("Error adding tournamenet "+tournamentName);
    }
		getAllTournament();
		setTournamentName("");
	}
	
	async function handleTournamentSelect(tName)
	{
		alert.show(tName);
		setTournamentName(tName);
		getTournamentTeams(tName)
		
	}

	async function handleAdd() {
		setMid(0);
		setTeam1("");
		setTeam2("");
		setStartDate(new Date());
		setStartTime(new Date());
		setIsDrawerOpened("ADD");
	}
	
  async function handleAddNew(idx) {
    setMatchName(newMatchList[idx].name);
    setCricApiId(newMatchList[idx].id);
    let d = new Date(newMatchList[idx].dateTimeGMT);
    d.setMinutes(d.getMinutes() + 330);
    
    let xxx = d.getFullYear().toString() +
      ("0" +(d.getMonth()+1)).slice(-2) +
      ("0" +(d.getDate())).slice(-2) +
      ("0" +d.getHours()).slice(-2) +
      ("0" +d.getMinutes()).slice(-2);
		setMid(Number(xxx));
		setTeam1(newMatchList[idx].teams[0]);
		setTeam2(newMatchList[idx].teams[1]);
		setStartDate(d);
    setStartTime(d);
		setIsDrawerOpened("ADDNEW");
	}
  
	async function handleEdit(t) {
		setMid(t.mid);
		setTeam1(t.team1);
		setTeam2(t.team2);
		setStartDate(new Date(t.matchStartTime));
		setStartTime(new Date(t.matchStartTime));
		setIsDrawerOpened("EDIT");
	}
	
	async function addEditMatchSubmit() {
		if (team1 === team2) {
			return alert.error("Team1 and Team2 are same");
		}
		
		if (isDrawerOpened === "ADD") {
			try {
				// add tournament
				console.log("Add");
				let myDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
					startTime.getHours(), startTime.getMinutes());
					console.log(myDate);
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/add/${tournamentName}/${tournamentType}/${mid}/${team1}/${team2}/${myDate.getTime()}`);
				alert.show("Successfully added team "+newTeamName);
				let tmpArray = [resp.data].concat(matchList);
				tmpArray = sortBy(tmpArray, 'matchStartTime');
				setMatchList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error adding tournament "+tournamentName);
			}
		} else if (isDrawerOpened === "EDIT") {
			try {
				// add tournament
				let myDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
					startTime.getHours(), startTime.getMinutes());
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/update/${tournamentName}/${tournamentType}/${mid}/${team1}/${team2}/${myDate.getTime()}`);
				alert.show("Successfully updated match "+mid);
	
				let tmpArray = matchList.filter(x => x.mid !== mid);
				tmpArray.push(resp.data);
				tmpArray = sortBy(tmpArray, 'matchStartTime');
				setMatchList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error updating details of tournament "+tournamentName);
			}
		}

	}
	
  	
	async function addNewMatchSubmit() {
    console.log("in add new");
		if (team1 === team2) {
			return alert.error("Team1 and Team2 are same");
		}
		
    console.log("t1 t2 diff");
    try {
      console.log("Add");
      let myDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
        startTime.getHours(), startTime.getMinutes());
        console.log(myDate);
      let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/add/${tournamentName}/${tournamentType}/${mid}/${team1}/${team2}/${myDate.getTime()}/${cricApiId}`);
      alert.show("Successfully added new match "+cricApiId);
      let tmpArray = [resp.data].concat(matchList);
      tmpArray = sortBy(tmpArray, 'matchStartTime');
      setMatchList(tmpArray);
      setIsDrawerOpened("")
    } 
    catch {
      alert.error("Error adding tournament "+tournamentName);
    }
	}
	

  
  
  function handleBack() {
		//sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(1);
	}
	
	function handleScore(t) {
		sessionStorage.setItem("shareMatch", JSON.stringify(t));
		setTab(5);
	}
	
	async function handleCancel(t) {
		try {
			// add tournament
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/team/count/${t.tournament}/${t.name}`);
			if (resp.data.count > 0) {
				alert.error("Cannot delete team "+t.name+". Delete players first");
				return;
			}
			// nor delete
			resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/delete/${t.mid}`);
			alert.success("Successfully removed match "+t.mid);
			let tmpArray = matchList.filter(x => x.mid !== t.mid);
			setMatchList(tmpArray);
		} catch {
			alert.error("Error removing match "+t.mid);
		}
	}
	
	function DisplayMatchList() {
	let colCount = 10;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`Matches of ${tournamentName} (${tournamentType})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"TH121"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Time
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Match Id
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team1
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team2
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Started
					</TableCell>
					<TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Over
					</TableCell>
					<TableCell key={"TH31"} component="th" colSpan={3} scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{matchList.map( (t, index) => {
				let myClass = classes.tdPending;
				let ttt = new Date(t.matchStartTime);
				let myDate = DATESTR[ttt.getDate()] + "/" +
					MONTHNUMBERSTR[ttt.getMonth()] + "/" + ttt.getFullYear();
		
				let myTime=HOURSTR[ttt.getHours()] + ":" + MINUTESTR[ttt.getMinutes()];
        
        //console.log(t.apiMatchId);
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myDate}
						</Typography>
					</TableCell>
					<TableCell key={"TD101"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myTime}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.mid}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.team1}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.team2}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{(t.matchStarted) ? "Started" : "Not Started"}
						</Typography>
					</TableCell>
					<TableCell key={"TD6"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{(t.matchEnded) ? "Over" : "Not Over"}
						</Typography>
					</TableCell>					
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => handleScore(t)}>Score</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<IconButton color="primary" size="small" onClick={() => { handleEdit(t) } } >
							<EditIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<VsCancel onClick={() => { handleCancel(t) } } />
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	

	
	function DisplayNewMatchList() {
  //return null;
	let colCount = 5;
  let justNow = new Date().getTime();
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"THN1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`New Matches of ${tournamentName} (${tournamentType})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"THN121"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Match API Id
					</TableCell>
					<TableCell key={"THN21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"THN22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team1
					</TableCell>
					<TableCell key={"THN23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team2
					</TableCell>
					<TableCell key={"THN31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{newMatchList.map( (t, index) => {
        let tmp = matchList.find(x => x.apiMatchId === t.id);
        if (tmp) return null;
        if (t.startTime.getTime() < justNow) return null;
        if (index < 3) {
          console.log(t.id);
          console.log(tmp);
        }
  
        //if (tmp) return null;
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROWN"+index}>
					<TableCell key={"TDN1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.id}
						</Typography>
					</TableCell>
					<TableCell key={"TDN2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.dateTimeGMT}
						</Typography>
					</TableCell>
					<TableCell key={"TDN3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.teams[0]}
						</Typography>
					</TableCell>
					<TableCell key={"TDN4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.teams[1]}
						</Typography>
					</TableCell>
					<TableCell key={"TDN5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => handleAddNew(index)}>Add</Link>
						</Typography>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	

	function handleDate(d) {
		setStartDate(d.toDate());
	}
	
	function handleTime(d) {
		setStartTime(d.toDate());
	}
	
  async function handlefetch() {
    var justNow = new Date().getTime();
    
    try {
      let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/newmatches/${tournamentSeriesId}`);
      alert.show("Successfully added matches of "+tournamentName);
      let dataArray = resp.data.newMatches;
      dataArray = sortBy(dataArray, 'dateTimeGMT');
      for(var i=0; i<dataArray.length; ++i) {
        var tmp = new Date(dataArray[i].dateTimeGMT);
        //console.log(i, tmp);
        dataArray[i]["startTime"] = tmp;
        //console.log(dataArray[i]);
      }
      console.log(dataArray.length+" matches");
      setNewMatchList(dataArray);
    } catch {
      alert.error("Error fetching new matches of "+tournamentName);
      setNewTournamentList([]);
    }   
  }
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
	<DisplayPageHeader headerName={`Configure Match of ${tournamentName}`} groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{(tournamentName === "") &&
		<Typography>Tournament not selected"</Typography>
	}
	{(tournamentName !== "") &&
	<div>
	<div align="right">
    <VsButton name="Back" align="left" onClick={handleBack} />
    {/*<VsButton name="Add new match" align="right" onClick={handleAdd} />*/}
	</div>
	<DisplayMatchList />
   <br />
   <VsButton name="Get New Match" align="right" onClick={handlefetch} />
	<DisplayNewMatchList />
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened === "EDIT"}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		<ValidatorForm className={gClasses.form} onSubmit={addEditMatchSubmit}>
		<Typography className={classes.title}>{((isDrawerOpened === "ADD") ?"New Team" : "Edit Team")+" for "+tournamentName}</Typography>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Match ID" 
			value={mid}
			disabled={isDrawerOpened === "EDIT"}
			onChange={() => { setMid(event.target.value) }}
			validators={['minNumber:1000']}
			errorMessages={['Invalid Match Number' ]}
		/>
		<Typography className={classes.title}>{"Team 1"}</Typography>
		<Select variant="outlined" required fullWidth label="Team 1" className={gClasses.vgSpacing}
			value={team1} onChange={(event) => setTeam1(event.target.value)}
		>
		{teamList.map(x =>
			<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
		</Select>
		<Typography className={classes.title}>{"Team 2"}</Typography>
		<Select variant="outlined" required fullWidth label="Team 2" className={gClasses.vgSpacing}
			value={team2} onChange={(event) => setTeam2(event.target.value)}
		>
		{teamList.map(x =>
			<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
		</Select>		
		<Typography className={classes.title}>{"Match Date"}</Typography>
		<Datetime 
			className={classes.dateTimeBlock}
			inputProps={{className: classes.dateTimeNormal}}
			timeFormat={false} 
			initialValue={startDate}
			dateFormat="DD/MM/yyyy"
			isValidDate={disablePastDt}
			onClose={handleDate}
		/>
		<Typography className={classes.title}>{"Match Time"}</Typography>
		<Datetime 
			className={classes.dateTimeBlock}
			inputProps={{className: classes.dateTimeNormal}}
			dateFormat={false} 
			timeFormat="HH:mm"
			initialValue={startTime}
			onClose={handleTime}
		/>
		<VsButton type="submit" name={(isDrawerOpened === "ADD") ? "Add" : "Update"} />
		<ValidComp />
		</ValidatorForm>
		</div>
	}
	</Drawer>
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened === "ADDNEW"}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		<div align="center">
		<ValidatorForm className={gClasses.form} onSubmit={addNewMatchSubmit}>
    <Typography className={gClasses.title}>{"Add New Match"}</Typography>
    <Typography className={gClasses.info18Bold}>{matchName}</Typography>
    <br />
		<TextValidator fullWidth  className={gClasses.vgSpacing}
			label="Match API Id" 
			value={cricApiId}
			disabled={true}
		/>		
    <br />
		<TextValidator fullWidth  type="number" className={gClasses.vgSpacing}
			label="Match ID" 
			value={mid}
			disabled={true}
		/>
    <br />
		<Typography className={classes.title}>{"Team 1"}</Typography>
		<Select variant="outlined" required fullWidth label="Team 1" className={gClasses.vgSpacing}
			value={team1} onChange={(event) => setTeam1(event.target.value)}
		>
		{teamList.map(x =>
			<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
		</Select>
    <br />
		<Typography className={classes.title}>{"Team 2"}</Typography>
		<Select variant="outlined" required fullWidth label="Team 2" className={gClasses.vgSpacing}
			value={team2} onChange={(event) => setTeam2(event.target.value)}
		>
		{teamList.map(x =>
			<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
		</Select>		
    <br />
		<Typography className={classes.title}>{"Match Date"}</Typography>
		<Datetime 
			className={classes.dateTimeBlock}
			inputProps={{className: classes.dateTimeNormal}}
			timeFormat={false} 
			initialValue={startDate}
			dateFormat="DD/MM/yyyy"
			isValidDate={disablePastDt}
			onClose={handleDate}
		/>
    <br />
		<Typography className={classes.title}>{"Match Time"}</Typography>
		<Datetime 
			className={classes.dateTimeBlock}
			inputProps={{className: classes.dateTimeNormal}}
			dateFormat={false} 
			timeFormat="HH:mm"
			initialValue={startTime}
			onClose={handleTime}
		/>
		<VsButton type="submit" name={"Add New"} />
		<ValidComp />
		</ValidatorForm>
		</div>
	}
	</Drawer>	</div>
	}
	</Container>
  </div>
  );    
}

