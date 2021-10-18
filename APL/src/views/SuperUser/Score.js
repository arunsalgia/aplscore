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
import _ from "lodash";
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
import { getImageName, disablePastDt, vsDialog } from "views/functions.js"
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


export default function Score() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isListDrawer, setIsListDrawer] = useState("");
	
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentType, setTournamentType] = useState("T20");
  const [tournamentDesc, setTournamentDesc] = useState("");
	
	const [mid, setMid] = useState(0);
	const [team1, setTeam1] = useState("");
	const [team2, setTeam2] = useState("");
	const [currentTeam, setCurrentTeam] = useState("");
	
	const [pid, setPid] = useState(0);
	const [playerName, setPlayerName] = useState("");
	
	const [run, setRuns] = useState(0);
	const [four, setFours] = useState(0);
	const [six, setSixes] = useState(0);
	const [duck, setDucks] = useState(0);
	
	const [wicket, setWickets] = useState(0);
	const [maiden, setMaidens] = useState(0);
	const [economy, setEconomy] = useState(0);
	
	const [stumped, setStumped] = useState(0);
	const [runout, setRunOuts] = useState(0);
	const [catches, setCatches] = useState(0);
	
	const [manOfTheMatch, setMom] = useState(0);
	
	const [playerList, setPlayerList] = useState([]);
	const [scoreList, setScoreList] = useState([]);
	
  const [teamName, setTeamName] = useState("");
	const [newTeamName, setNewTeamName] = useState("");
	const [teamList, setTeamList] = useState([]);
  const [matchList, setMatchList] = useState([]);
	
  const [labelNumber, setLabelNumber] = useState(0);
  const [newTeamList, setNewTeamList] = useState([]);


	const [startDate, setStartDate] = useState(new Date());
	const [startTime, setStartTime] = useState(new Date());
	
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
				let mRec = JSON.parse(sessionStorage.getItem("shareMatch"));
				setMid(mRec.mid);
				setTeam1(mRec.team1);
				setTeam2(mRec.team2);
				setCurrentTeam(mRec.team1)
				getScore(tRec.name, mRec.mid)
				getAllPlayers(tRec.name, mRec.team1, mRec.team2);
			} catch (e) {
				alert.error("Tournament / Match not specified");
			}
		}
		//a();
		tournament();
  }, [])

	
	async function getAllPlayers(myTournament, myTeam1, myTeam2) {
		let myPlayers=[];
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/tteam/${myTournament}/${myTeam1}`);
			myPlayers = myPlayers.concat(resp.data);
			resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/tteam/${myTournament}/${myTeam2}`);			 
			myPlayers = myPlayers.concat(resp.data);
			
		} catch(e) {
			console.log(e)
			alert.error("error fetching team list of "+myTeam1+" and "+myTeam2);
		}
		//console.log(myPlayers);
		setPlayerList(_.sortBy(myPlayers, 'name'));
	}

	async function getScore(myTournament, myMid) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/score/${myTournament}/${myMid}`);
			console.log(resp.data);
			setScoreList(resp.data);
		} catch(e) {
			console.log(e)
			setScoreList([]);
			alert.error("error fetching score of match "+myMid);
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
  

	async function handleAdd() {
		setPid(0);
		setPlayerName("");
		
		setRuns(0);
		setFours(0);
		setSixes(0);
		setDucks(0);
		
		setWickets(0);
		setMaidens(0);
		setEconomy(0);
		
		setStumped(0);
		setCatches(0);
		setRunOuts(0);
		
		setMom(0);
		setIsDrawerOpened("ADD");
	}
	
	async function handleEdit(t) {
		setPid(t.pid);
		setPlayerName(t.playerName);
		
		setRuns(t.run);
		setFours(t.four);
		setSixes(t.six);
		setDucks(t.duck);
		
		setWickets(t.wicket);
		setMaidens(t.maiden);
		setEconomy(t.economy);
		
		setStumped(t.stumped);
		setCatches(t.catch);
		setRunOuts(t.runout);
		
		setMom((t.manOfTheMatch) ? 1 : 0);
		setIsDrawerOpened("EDIT");
	}
	
	async function addEditScoreSubmit() {		
		//console.log(run, duck);
		
		if (run < four*4) return alert.error("Invalid four");
		if (run < six*6) return alert.error("Invalid six");
		if (run < (four*4 + six*6)) return alert.error("Invalid run/four/six");
		if ((run > 0) && (duck > 0)) return alert.error("Duck not allowed if run greater than 0");
		
		console.log(runout + stumped , runout + catches, stumped + catches, runout + stumped + catches);
		if ((runout + stumped + catches) > 10) return alert.error("Invalid run outs/stumped/catch");
		
		let playerData;
		
		if (isDrawerOpened === "EDIT") {
			playerData = scoreList.find(x => x.pid === pid);
		} if (isDrawerOpened === "ADD") { 
			let tmp = scoreList.find(x => x.pid === pid);
			if (tmp) return alert.error(`Duplicate player ${playerName}`);
			playerData = {};
		}
			
		playerData = {
			mid: mid,
			pid: pid, 
			playerName: playerName,
			
			run: run,
			four: four,
			six: six,
			duck: duck,
			
			wicket: wicket,
			maiden: maiden,
			economy: economy,
			
			runout: runout,
			stumped: stumped,
			catch: catches,
			manOfTheMatch: (manOfTheMatch == 1)
		}

		let tmpArray = scoreList.filter(x => x.pid !== pid);
		tmpArray.push(playerData);
		tmpArray = _.sortBy(tmpArray, 'playerName');
		setScoreList(tmpArray);
		setIsDrawerOpened("");
	}

	async function handleCancel(t) {
		vsDialog(
			'Delete Score', 
			`Are you sure you want to delete score of ${t.playerName}`,
			{label: 'Yes', onClick: () => handleCancelConfirm(t) },
			{label: 'No'}
		)
	}
	
	async function handleCancelConfirm(t) {
		let tmpArray = scoreList.filter(x => x.pid !== t.pid);
		setScoreList(tmpArray);
	}
	
	
	function DisplayScoreList() {
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH00"} component="th" scope="row" align="center" padding="none"
						className={classes.th} colSpan={2}>
						{`${team1}`}
					</TableCell>
					<TableCell key={"TH01"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={11}>
					{`Score of match ${mid} between ${team1} and ${team2}`}
					</TableCell>
					<TableCell key={"TH02"} component="th" scope="row" align="center" padding="none"
						className={classes.th} colSpan={2}>
						{`${team2}`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					PID
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Runs
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Fours
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Six
					</TableCell>
					<TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Duck
					</TableCell>
					<TableCell key={"TH27"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Wickets
					</TableCell>
					<TableCell key={"TH28"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Economy
					</TableCell>
					<TableCell key={"TH29"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Maidens
					</TableCell>
					<TableCell key={"TH30"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					RunOut
					</TableCell>
					<TableCell key={"TH31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Stumped
					</TableCell>
					<TableCell key={"TH32"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Catch
					</TableCell>
					<TableCell key={"TH33"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Mom
					</TableCell>
					<TableCell key={"TH91"} component="th" colSpan={2} scope="row" align="center" padding="none"
					className={classes.th} >
					Cmd
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{scoreList.map( (t, index) => {
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.pid}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.playerName}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.run}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.four}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.six}
						</Typography>
					</TableCell>
					<TableCell key={"TD6"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.duck}
						</Typography>
					</TableCell>
					<TableCell key={"TD7"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.wicket}
						</Typography>
					</TableCell>
					<TableCell key={"TD8"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.economy}
						</Typography>
					</TableCell>
					<TableCell key={"TD9"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.maiden}
						</Typography>
					</TableCell>
					<TableCell key={"TD10"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.runout}
						</Typography>
					</TableCell>
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.stumped}
						</Typography>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.catch}
						</Typography>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{(t.manOfTheMatch) ? 1 : 0}
						</Typography>
					</TableCell>
					<TableCell key={"TD91"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<IconButton color="primary" size="small" onClick={() => { handleEdit(t) } } >
							<EditIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD92"+index} align="center" component="td" scope="row" align="center" padding="none"
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
	
	function DisplayPlayerMenu() {
	return (	
		<div>
		<VsCancel align="right" onClick={() => setIsListDrawer("")} />
		{playerList.map( (p, index) =>
			<MenuItem key={p.name} value={p.name}>
			<Typography onClick={() => { setPid(p.pid); setPlayerName(p.name); setIsListDrawer(""); } }>
				{p.name}
			</Typography>
			</MenuItem>
		)}
		</div>
	)}
	
	async function handleUpdate() {
		try {
			let tmp = JSON.stringify(scoreList);
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/setscore/${tournamentName}/${mid}/${tmp}`);
			alert.success("Score update success");
		} catch(e) {
			console.log(e)
			alert.error("error updating score list of match"+mid);
		}
	}
	
	async function handleClose() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/match/setclose/${tournamentName}/${mid}`);
			alert.succes("Match close success");
		} catch(e) {
			console.log(e)
			alert.error("error updating score list of match"+mid);
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
	<VsButton name="Add new player" align="right" onClick={handleAdd} />
	<DisplayScoreList />
	<VsButton align="right" name="Update match score" onClick={handleUpdate} />
	<VsButton align="right" name="Set match Close" onClick={handleClose} />
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		{(isDrawerOpened === "ADD") &&
			<VsButton name="Select Player" align="right" onClick={() => setIsListDrawer("LIST") } />
		}
		<ValidatorForm className={gClasses.form} onSubmit={addEditScoreSubmit}>
		<Typography className={classes.title}>{((isDrawerOpened === "ADD") ?"New Player" : "Edit Player")+" for match "+mid}</Typography>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Player ID" 
			value={pid}
			disabled
			validators={['minNumber:1000']}
			errorMessages={['Invalid Player NUmber' ]}
		/>
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Player Name" 
			value={playerName}
			disabled
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Runs" 
			value={run}
			disabled={pid===0}
			onChange={() => { setRuns(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Runs' ]}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Fours" 
			value={four}
			disabled={pid===0}
			onChange={() => { setFours(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Fours' ]}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Sixes" 
			value={six}
			disabled={pid===0}
			onChange={() => { setSixes(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Sixes' ]}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Duck" 
			value={duck}
			disabled={pid===0}
			onChange={() => { setDucks(Number(event.target.value)) }}
			validators={['minNumber:0', 'maxNumber:1']}
			errorMessages={['Invalid Duck','Invalid Duck' ]}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Wickets" 
			value={wicket}
			disabled={pid===0}
			onChange={() => { setWickets(Number(event.target.value)) }}
			validators={['minNumber:0', 'maxNumber:10']}
			errorMessages={['Invalid Wicket','Invalid Wicket' ]}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Economy" 
			value={economy}
			disabled={pid===0}
			onChange={() => { setEconomy(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Economy']}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Maidens" 
			value={maiden}
			disabled={pid===0}
			onChange={() => { setMaidens(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Maidens']}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Run Outs" 
			value={runout}
			disabled={pid===0}
			onChange={() => { setRunOuts(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Run outs']}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Stumped" 
			value={stumped}
			disabled={pid===0}
			onChange={() => { setStumped(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Stumped']}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Catches" 
			value={catches}
			disabled={pid===0}
			onChange={() => { setCatches(Number(event.target.value)) }}
			validators={['minNumber:0']}
			errorMessages={['Invalid Catches']}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Man of the match" 
			value={(manOfTheMatch) ? 1 : 0}
			disabled={pid===0}
			onChange={() => { setMom(Number(event.target.value)) }}
			validators={['minNumber:0', 'maxNumber:1']}
			errorMessages={['Invalid Mom','Invalid Mom']}
		/>
		<VsButton type="submit" name={(isDrawerOpened === "ADD") ? "Add" : "Update"} />
		<ValidComp />
		</ValidatorForm>
		</div>
	}
	</Drawer>
	<Drawer className={classes.drawer}
		anchor="left"
		variant="temporary"
		open={isListDrawer !== ""}
	>
		<DisplayPlayerMenu />
	</Drawer>
	</div>
	}
	</Container>
  </div>
  );    
}

