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
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useAlert } from 'react-alert'
//import { confirmAlert } from 'react-confirm-alert';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsSelect from "CustomComponents/VsSelect";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";

import globalStyles from "assets/globalStyles";
import sortBy from "lodash/sortBy";
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName, vsDialog } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea} from "CustomComponents/CustomComponents.js"
import {red, blue, deepOrange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

var RoleOptions = ["Batsman", "Bowler", "AllRounder", "Wk"];
var BattingOptions = ["NA", "Left-handed", "Right-handed" ]
var BowlingOptions = ["NA", "Left arm medium", "Right arm medium", "Left arm orthodox", "Right arm orthodox" , "Left arm offbreak", "Right arm offbreak", "Left arm legbreak", "Right arm legbreak", "Left arm fast-medium", "Right arm fast-medium"]

const useStyles = makeStyles((theme) => ({
	title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700],
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

const FETCHTYPES = ["SQUAD", "INFO"];

export default function Team() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isListDrawer, setIsListDrawer] = useState("");
	
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [teamName, setTeamName] = useState("");
	const [groupList, setGroupList] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState([]);
	
	
	const [newPlayer, setNewPlayer] = useState(false);
  const [playerList, setPlayerList] = useState([]);
	const [allPlayerList, setAllPlayerList] = useState([]);
	const [filterPlayerList, setFilterPlayerList] = useState([]);
  const [playerInfoList, setPlayerInfoList] = useState([]);
	const [filter, setFilter] = useState("");

  const [filterTeam, setFilterTeam] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  
	const [selPlayerName, setSelPlayerName] = useState([]);
	
	const [pid, setPid] = useState(0);
	const [playerName, setPlayerName] = useState("");
	const [role, setRole] = useState("AllRounder");
	const [battingStyle, setBattingStyle] = useState("NA");
	const [bowlingStyle, setBowlingStyle] = useState("NA");
  const [cricPlayerId, setCricPlayerId] = useState("");

  const [fetchFrom, setFetchFrom] = useState("SQUAD");
	
	const [cancelPlayerRec, setCancelPlayerRec] = useState({});
	const [isCancel, setIsCancel] = useState(false);
	
	const [teamData, setTeamData] = useState({});

	const [searchText, setSearchText] = useState("");

  const [cricPlayerList, setCricPlayerList] = useState([]);
  const [cricTeamList, setCricTeamList] = useState([]);

  const [masterRole, setMasterRole] = useState("");
  const [masterBowlStyle, setMasterBowlStyle] = useState("");
  const [masterBatStyle, setMasterBatStyle] = useState("");
  
	const [originalPlayerRec, setOriginalPlayerRec] = useState(null);
	const [replacementPlayerRec, setReplacementPlayerRec] = useState(null);
	
  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
			const tournament = async () => {
				try {
          let myTournmentRec = JSON.parse(sessionStorage.getItem("shareTournament")); 
          setTournamentId(myTournmentRec.cricTid);
          
					let tRec = JSON.parse(sessionStorage.getItem("shareTeam")); 
          //console.log(tRec);
					setTeamData(tRec);
					setTournamentName(tRec.tournament);
          
					setTeamName(tRec.name);
					getTeamPlayers(tRec.tournament, tRec.name);
					getAllPlayers();
					
					getAllGroups(tRec.tournament);
					
				} catch (e) {
					alert.error("Team name not specified");
				}
			}
      //a();
			tournament();
  }, [])

	async function getTeamPlayers(tournament, myTeam) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/tteam/${tournament}/${myTeam}`);
			 setPlayerList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching team list of "+myTeam);
			setPlayerList([]);
		}
	}
	
	async function getAllPlayers() {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/cricdatauniquelist`);
			 setAllPlayerList(resp.data);
			 //setFilterPlayerList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching all player list");
			setPlayerList([]);
		}
	}
	
		async function getAllGroups(tname) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getgroupbytournament/${tname}`);
			 setGroupList(resp.data);
			 //setFilterPlayerList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching group list");
			//setPlayerList([]);
		}
	}
	
	async function getTournamentTeams(myName) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/tournament/${myName}`);
			 setTournamentList(resp.data);
			 alert.status("Fetched teams of tournament "+tournamentName);
		} catch(e) {
			console.log(e)
			alert.error("error fetching tournament list");
		}
	}
	
  function getNewTeamLabel() {
    let newNum = labelNumber + 1;
    setLabelNumber(newNum);
    return `TEAM${newNum}`;
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

 
  function GetTeam(props) {
    // console.log("Get Team");
    let myLabel=`LABEL_${props.myTeam.label}`;
    if (props.myTeam.existingTeam) {
      // let tmp = playerList.find(x => x.name === props.myTeam.name)
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
        {playerList.map(x =>
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
            <GridItem xs={3} sm={3} md={3} lg={3} >
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

	function handleBack() {
		//sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(2);
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
      //setPlayerList([]);
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

	async function handleBack() {
		sessionStorage.setItem("shareData", teamData);
		setTab(2);
	}
	
	async function handleAdd() {
		setPid(0);
		setPlayerName("");
		setRole("AllRounder");
		setBowlingStyle("NA");
		setBattingStyle("NA")
		setIsDrawerOpened("ADD");
	}
	
	async function handleEdit(t) {
		setPid(t.pid);
		setPlayerName(t.name);
		setRole(t.role);
		setBowlingStyle(t.bowlingStyle);
		setBattingStyle(t.battingStyle)
		setIsDrawerOpened("EDIT");
	}
	
	async function handleReplace(t) {
		//console.log(t);
		setOriginalPlayerRec(t)
		setReplacementPlayerRec(null);
		let arr = new Array(groupList.length).fill(0);
		//console.log(arr);
		setSelectedGroup(arr);
		setIsDrawerOpened("REPLACEMENT");
	}
	
	
	
	async function addEditTeamSubmit() {
		//console.log("In addEditTeamSubmit");
		if (isDrawerOpened === "ADD") {
			try {
				// add tournament
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/add/${pid}/${playerName}/${tournamentName}/${teamName}/${role}/${battingStyle}/${bowlingStyle}/${cricPlayerId}`);
				alert.show("Successfully added Player "+playerName);
				let tmpArray = [resp.data].concat(playerList);
				tmpArray = sortBy(tmpArray, 'name');
				setPlayerList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error adding player "+playerName);
			}
		} else if (isDrawerOpened === "EDIT") {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/update/${pid}/${playerName}/${tournamentName}/${teamName}/${role}/${battingStyle}/${bowlingStyle}`);
				alert.show("Successfully update Player "+pid);
				let tmpArray = playerList.filter(x => x.pid !== pid)
				tmpArray = [resp.data].concat(tmpArray);
				tmpArray = sortBy(tmpArray, 'name');
				setPlayerList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error updating details of tournament "+tournamentName);
			}
		}

	}
	
	async function oldhandleCancel(t) {
		console.log("In cancel");
		confirmAlert(
		{
			title: 'Delete Player',
			message: `Are you sure you want to delete player ${t.name} fewfew few fqewf ewfew few few few fewf ewf ewf wf f ewfew few few few few f ewf ewf ewf ewfqew `,
      buttons: [
        {label: 'Yes', onClick: () => handleCancelConfirm(t)},
        {label: 'No',  onClick: () => alert.error('Click No')}
				//{label: 'NotSure',  onClick: () => alert.error('Click No')}
        //}
      ],
			childrenElement: () => <div />,
			customUI: ({ onClose }) => <div>Custom UI</div>,
			closeOnEscape: true,
			closeOnClickOutside: true,
			willUnmount: () => {},
			afterClose: () => {},
			onClickOutside: () => {},
			onKeypressEscape: () => {},
			overlayClassName: "overlay-custom-class-name"
		})
	}
	
	
	async function handleCancel(t) {
		vsDialog(
			'Delete Player', 
			`Are you sure you want to delete player ${t.name}`,
			{label: 'Yes', onClick: () => handleCancelConfirm(t) },
			{label: 'No'}
		)
	}
	
	
	async function handleCancelConfirm(t) {
		try {
			// now delete
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/delete/${t.pid}/${t.tournament}/${t.Team}`);
			alert.success("Successfully removed player "+t.name);
			let tmpArray = playerList.filter(x => x.name !== t.name);
			setPlayerList(tmpArray);
		} catch {
			alert.error("Error removing player "+t.name);
		}
	}
	
	function selectPlayer(pRec) {
		var tmp = ""
		setIsListDrawer("");
		setPid(pRec.pid);
    setCricPlayerId(pRec.cricPid);
		setPlayerName(pRec.name.trim());
    tmp = pRec.role.trim().toLowerCase();
    console.log(tmp);
    if (tmp.includes("wk")) 
      tmp = "Wk";
    else if  (tmp.includes("rounder"))
      tmp = "AllRounder";
    else if  (tmp.includes("bats"))
      tmp = "Batsman";
    else if  (tmp.includes("bow"))
      tmp = "Bowler";
    else
      tmp = "AllRounder";
		setRole(tmp);
    
		setBattingStyle(pRec.battingStyle.trim());
		setBowlingStyle(pRec.bowlingStyle.trim());
    
    setIsDrawerOpened("ADD");
	}
	
	function handlePlayerFilter(playerName) {
		playerName = playerName.trim();
		//console.log(playerName);
		//console.log("handlePlayerFilter");
		setFilter(playerName);
		let myFIlterPlayers = allPlayerList.filter(x => x.name.toLowerCase().includes(playerName));
		//console.log(myFIlterPlayers)
		setFilterPlayerList(myFIlterPlayers);	
	}


	function PlayerMenuItem() {
	return (	
		<div>
		{filterPlayerList.map( (p, index) =>
			<MenuItem key={p.name} value={p.name}>
			<Typography onClick={() => selectPlayer(p)}>
				{p.name}
			</Typography>
			</MenuItem>
		)}
		</div>
	)}
	
	
	function DisplayPlayerList() {
	let colCount = 8;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`Players of ${teamName} (${tournamentName})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Pid
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Role
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Batting Style
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Bowling Style
					</TableCell>
					<TableCell key={"TH31"} component="th" colSpan={3} scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{playerList.map( (t, index) => {
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROW"+index}>
					{/*<TableCell key={"TD0"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Avatar variant="square" 
							src={`https://www.cricapi.com/playerpic/${t.pid}.JPG`} 
							className={classes.medium} 
						/>    
						Bhanuka Rajapaksa
						Bjorn Fortuin
						Hari Nishanth
						Shakib Al Hasan
						Vaibhav Arora

				</TableCell>*/}
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.pid}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.name}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.role}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.battingStyle}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.bowlingStyle}
						</Typography>
					</TableCell>	
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<FindReplaceIcon color="primary" size="small" onClick={() => { handleReplace(t) } } />
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
	
  function updateFilter(team, name, role) {
    let myTempList = [].concat(cricPlayerList);
    if (team != "")
      myTempList = myTempList.filter(x => x.teamName.toLowerCase().includes(team));
    if (name != "");
      myTempList = myTempList.filter(x => x.name.toLowerCase().includes(name));
    if (role != "");
      myTempList = myTempList.filter(x => x.role.toLowerCase().includes(role));
    
    setFilterPlayerList(myTempList);
  }
  
  function handleTeamClear() {
    setFilterTeam("");
    updateFilter("", filterName, filterRole);
  }
  
  function handleTeamFilter(txt) {
    let tmp = txt.toLowerCase();
    setFilterTeam(tmp);
    updateFilter(tmp, filterName, filterRole);
  }

  function handleNameClear() {
    setFilterName("");
    updateFilter(filterTeam, "", filterRole);
  }
  
  function handleNameFilter(txt) {
    let tmp = txt.toLowerCase();
    setFilterName(tmp);
    updateFilter(filterTeam, tmp, filterRole);
  }
  
  
  function handleRoleClear() {
    setFilterRole("");
    updateFilter(filterTeam, filterName, "");
  }
  
  function handleRoleFilter(txt) {
    let tmp = txt.toLowerCase();
    setFilterRole(tmp);
    updateFilter(filterTeam, filterName, tmp);
  }
  
  async function handleAddNewPlayer(id) {
    console.log(id);
    var tmp = cricPlayerList.find(x => x.id === id);
    //console.log(tmp);
    var d = new Date();
    let xxx = (d.getFullYear() % 100).toString() +
      ("0" +(d.getMonth()+1)).slice(-2) +
      ("0" +(d.getDate())).slice(-2) +
      ("0" +d.getHours()).slice(-2) +
      ("0" +d.getMinutes()).slice(-2) +
      ("0" +d.getSeconds()).slice(-2);
      
    setPid(Number(xxx));
    setCricPlayerId(tmp.id)
    setPlayerName(tmp.name);
    setBattingStyle(tmp.battingStyle);
    setBowlingStyle(tmp.bowlingStyle);
    setRole(tmp.role);
    setIsDrawerOpened("ADD");

    setMasterBatStyle(tmp.battingStyle);
    setMasterBowlStyle(tmp.bowlingStyle);
    setMasterRole(tmp.role);
    
  }
  
    
  async function handleAddNewPlayerInfo(id) {
    console.log(id);
    var tmp = playerInfoList.find(x => x.id === id);
    //console.log(tmp);
    var d = new Date();
    let xxx = (d.getFullYear() % 100).toString() +
      ("0" +(d.getMonth()+1)).slice(-2) +
      ("0" +(d.getDate())).slice(-2) +
      ("0" +d.getHours()).slice(-2) +
      ("0" +d.getMinutes()).slice(-2) +
      ("0" +d.getSeconds()).slice(-2);
      
    setPid(Number(xxx));
    setCricPlayerId(tmp.id)
    setPlayerName(tmp.name);
    setBattingStyle("");
    setBowlingStyle("NA");
    setRole("Batsman");
    setIsDrawerOpened("ADD");
  }
  
	function DisplayNewPlayerList() {
	let colCount = 5;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"THN1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`Players fetched from Cricapi of (${tournamentName})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"THN91"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team
					</TableCell>
					<TableCell key={"THN22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"THN23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Role
					</TableCell>
					<TableCell key={"THN31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{filterPlayerList.map( (t, index) => {
        let tmp = playerList.find(x => x.cricPid === t.id);
        if (tmp) return null;
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TNROW"+index}>
					<TableCell key={"TDN91"+index} align="center" component="td" scope="row" align="center" padding="none" className={myClass}>
						<Typography className={classes.apptName}>{t.teamName}</Typography>
					</TableCell>
					<TableCell key={"TDN2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.name}
						</Typography>
					</TableCell>
					<TableCell key={"TDN3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.role}
						</Typography>
					</TableCell>
					<TableCell key={"TDN11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Link href="#" variant="body2" onClick={() => { handleAddNewPlayer(t.id);}}>Add</Link>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	
  
  function DisplayPlayerInfoList() {
    let colCount = 4;
    return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow key={"THN1"}  align="center">
					<TableCell component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`Players Info from Cricapi`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Id
					</TableCell>
					<TableCell component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Country
					</TableCell>
					<TableCell component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{playerInfoList.map( (t, index) => {
        let tmp = playerList.find(x => x.cricPid === t.id);
        if (tmp) return null;
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TNROW"+index}>
					<TableCell align="center" component="td" scope="row" align="center" padding="none" className={myClass}>
						<Typography className={classes.apptName}>{t.id}</Typography>
					</TableCell>
					<TableCell align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.country}
						</Typography>
					</TableCell>
					<TableCell align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.name}
						</Typography>
					</TableCell>
					<TableCell align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Link href="#" variant="body2" onClick={() => { handleAddNewPlayerInfo(t.id);}}>Add</Link>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	
	function handlePlayerSelect(ppid) {
		let myPlayer = allPlayerList.find(x => x.pid === ppid);
		setPid(myPlayer.pid);
		setPlayerName(myPlayer.name);
		setRole(myPlayer.role);
		setBattingStyle(myPlayer.battingStyle);
		setBowlingStyle(myPlayer.bowlingStyle);
		setSelPlayerName(myPlayer.pid);
	}
	
	function selectExistingPlayer() {
		setFilter("");
		setSearchText("");
		setFilterPlayerList(allPlayerList);
		setIsListDrawer("PLAYERLIST");
		console.log("In select")
	}

	function DisplayFilter() {
	return (
	<div>
		<Grid container justify="center" alignItems="center" >
		<GridItem xs={9} sm={9} md={9} lg={9} >
				<TextField className={classes.filter} 
			variant="outlined" margin="none" size="small" defaultValue={filter}
		/> 
	</GridItem>
	<GridItem xs={3} sm={3} md={3} lg={3} >
		
	</GridItem>
	</Grid>

	</div>
	)}

	function updateFilterPlayerList(playerInfo) {
		let tmp = playerInfo.toLowerCase()
		setSearchText(tmp);
		//console.log(tmp);
		if (tmp != "") {
			setFilterPlayerList(allPlayerList.filter(x => x.name.toLowerCase().includes(tmp)));
		} 
		else  {
			console.log("BLANK");
			setFilterPlayerList(allPlayerList);
		}
	}
	
  async function handleFetchPlayerInfo() {
   try {
      let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/search/${filterName}`);
      alert.show("Successfully fetched players");
			console.log(resp.data);
      setPlayerInfoList(resp.data);
    } catch {
      alert.error("Error fetching player info");
      setPlayerInfoList([]);
    }   
  }
  
  async function handleFetch() {
    var justNow = new Date().getTime();
    //console.log(tournamentId);
    try {
      let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/cricapi/${tournamentId}`);
      alert.show("Successfully fetched players of tournament "+tournamentName);
      setCricPlayerList(resp.data.players);
      setFilterPlayerList(resp.data.players);
      //setCricTeamList(resp.data.teams);
    } catch {
      alert.error("Error fetching teams of "+tournamentName);
      setCricPlayerList([]);
      setCricTeamList([]);
    }   
  }
  
  function updatePlayerString(txt) { setFilterName(txt); console.log(txt); }
  
  
  function handleRadioSelection(value) {
    setFilterPlayerList([]);
    setPlayerInfoList([]);
    setFilterName("");
    setFilterRole("");
    setFilterTeam("");
    setFetchFrom(value);
  }
  
	/*
	============= Replace,ent 
	*/
	
	async function handleReplaceSubmit() {
		if (!replacementPlayerRec ) {
			alert.error("Replacement player not selected");
		}
		else if (selectedGroup.filter(x => x !== 0).length === 0)
			alert.error("No groups have been selected");
		else {
			var myData = {
				tournament: tournamentName,
				//team: teamName,
				originalPlayer: originalPlayerRec,
				replacementPlayer: replacementPlayerRec,
				groupList:  selectedGroup.filter(x => x !== 0)
			};
			console.log(myData);
			myData = encodeURIComponent(JSON.stringify(myData));
			var resp = null;
			try {
				// apply for both admin and member
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/player/replace/${myData}`;
			  resp = await axios.get(myUrl);
				alert.show(`Successfully added replacement player ${replacementPlayerRec.name}`);
				setIsDrawerOpened("");
			} 
			catch (e) {
				//console.log(e.response);
				switch (e.response.status) {
					case 601:  alert.error("Replacement player already purchased"); break;
					default:   alert.error("Unable to update the detail"); break;
				}
				
			}	
		}
	}
	
	function handleSelectAll() {
		var arr = [].concat(selectedGroup);
		for(var i=0; i<groupList.length; ++i) {
			arr[i] = groupList[i].gid;
		}
		setSelectedGroup(arr);		
	}
	
	function handleDeselectAll() {
		var arr = [].concat(selectedGroup);
		for(var i=0; i<groupList.length; ++i) {
			arr[i] = 0;
		}
		setSelectedGroup(arr);		
	}
	
	function handleSelectGroup(idx) {
		var arr = [].concat(selectedGroup);
		arr[idx] = (arr[idx] !== 0) ? 0 : groupList[idx].gid;
		setSelectedGroup(arr);
	}
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
	<DisplayPageHeader headerName={`Configure players of team ${teamName} (Tournament: ${tournamentName})`} groupName="" tournament=""/>
	<Container component="main" maxWidth="md">
	<CssBaseline />
	{(teamName === "") &&
		<Typography>Team not selected"</Typography>
	}
	{(teamName !== "") &&
	<div>
	<div align="right">
		<Grid container alignItems="center" >
			<GridItem xs={6} sm={6} md={6} lg={6} >
				<VsButton name="Back" align="left" onClick={handleBack} />
			</GridItem>
			<GridItem xs={6} sm={6} md={6} lg={6} >
				{/*<VsButton align="right" name="Add new Player" onClick={handleAdd} />*/} 
        <VsButton align="right" name="Add Player from DB" onClick={selectExistingPlayer} />
			</GridItem>
		</Grid>
	</div>
  <DisplayPlayerList />
  <br />
  <VsRadioGroup value={fetchFrom} radioList={FETCHTYPES} onChange={(event) => handleRadioSelection(event.target.value)}  />
  {(fetchFrom === "SQUAD") &&
    <div>
    <VsButton  name="Fetch Players" onClick={handleFetch} />
    <Grid container justify="center" alignItems="center" >
      <GridItem xs={4} sm={4} md={4} lg={4} >
        <VsTextSearch label="Filter Team" value={filterTeam} onClear={handleTeamClear} 
          onChange={(event) => handleTeamFilter(event.target.value)} />
      </GridItem>
      <GridItem xs={4} sm={4} md={4} lg={4} >
        <VsTextSearch label="Filter Name" value={filterName} onClear={handleNameClear} 
        onChange={(event) => handleNameFilter(event.target.value)} />
      </GridItem>
      <GridItem xs={4} sm={4} md={4} lg={4} >
        <VsTextSearch label="Filter Role" value={filterRole} onClear={handleRoleClear} 
        onChange={(event) => handleRoleFilter(event.target.value)} />
      </GridItem>
    </Grid>
    <br />
    <DisplayNewPlayerList />
    </div>
  }
  {(fetchFrom != "SQUAD") &&
    <div>
      <Grid container justify="center" alignItems="center" >
        <GridItem xs={8} sm={8} md={8} lg={8} >
          <TextField fullWidth  className={gClasses.vgSpacing}
            label="Player Name sub-string" 
            value={filterName}
            onChange={() => { setFilterName(event.target.value) }}
          />
        </GridItem>
        <GridItem xs={4} sm={4} md={4} lg={4} >
          <VsButton align="right" name="Players Info" onClick={handleFetchPlayerInfo} />
        </GridItem>
      </Grid>
      <br />
      <DisplayPlayerInfoList />
    </div>
  }
  <br />
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{(isDrawerOpened === "REPLACEMENT") &&
		<div align="center">
			<Typography style={{padding: "5px"}}>
				<span className={gClasses.info18} >{`Original player: `}</span>
				<span className={gClasses.info18Blue} >{`${originalPlayerRec.name}`}</span>
			</Typography>
			<br />
			<Typography style={{padding: "5px"}} className={gClasses.info18} >Replacement Player:</Typography>
			<Autocomplete
				disablePortal
				id="REPLAYERSELECT"
				value={replacementPlayerRec}
				onChange={(event, values) => setReplacementPlayerRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.name || ""}
				options={playerList}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} />}
			/>	
			<Grid key={`SELECTGROUPSBTNS`} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<VsButton name="Select All" align="left" onClick={handleSelectAll} />
			</Grid>	
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<VsButton name="Deselect All" align="right" onClick={handleDeselectAll} />
			</Grid>
			</Grid>								
			<Grid key={`SELECTGROUPSHDR`} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<Typography align="left" style={{marginLeft: "10px"}} className={gClasses.titleBrown}>Group Name</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{marginRight: "5px"}} className={gClasses.titleBrown}>{"Update"}</Typography>
				</Grid>
			</Grid>								
			
			{groupList.map( (g, index) => {
				return (
					<Grid key={`SELECTGROUPS${index}`} className={gClasses.noPadding} container  alignItems="flex-start" >
						<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={9} sm={9} md={9} lg={9} >
							<Typography align="left" style={{marginLeft: "10px"}} className={gClasses.info18Blue}>{g.name}</Typography>
						</Grid>	
						<Grid align="center" item xs={3} sm={3} md={3} lg={3} >
							<VsCheckBox align="center" checked={selectedGroup[index] !== 0} onClick={() => handleSelectGroup(index) }  />
						</Grid>
					</Grid>								
				)}
			)}
			<ValidatorForm className={gClasses.form} onSubmit={handleReplaceSubmit} >
				<VsButton type="submit" align="center" name="Replace" />
			</ValidatorForm>
		</div>
	}
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		<ValidatorForm className={gClasses.form}>
		<Typography className={classes.title}>{(isDrawerOpened === "ADD") ?"New Player" : "Edit Player"}</Typography>
		{(isDrawerOpened === "ADD") &&
      <Typography style={{padding: "5px"}} className={gClasses.info18} >({masterRole}/{masterBatStyle}/{masterBowlStyle})</Typography>
		}
		<BlankArea />
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Cric Id" 
			value={cricPlayerId}
			disabled={true}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Pid" 
			value={pid}
			disabled={true}
			onChange={() => { setPid(event.target.value) }}
			validators={["minNumber:1000)"]}
			errorMessages={['Invalid PID']}
		/>
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Name" 
			value={playerName}
			onChange={() => { setPlayerName(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
    <br />
    {/*
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Role" 
			value={role}
			onChange={() => { setRole(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
    */}
    <VsSelect label="Role" fullWidth options={RoleOptions} value={role}  onChange={(event) => setRole(event.target.value) }/>
    <br />
    {/*
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Batting Style" 
			value={battingStyle}
			onChange={() => { setBattingStyle(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>*/}
    <VsSelect label="Batting Style" fullWidth options={BattingOptions} value={battingStyle}  onChange={(event) => setBattingStyle(event.target.value) }/>
    <br />
    {/*
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Bowling Style" 
			value={bowlingStyle}
			onChange={() => { setBowlingStyle(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
    */}
    <VsSelect label="Bowling Style" fullWidth options={BowlingOptions} value={bowlingStyle}  onChange={(event) => setBowlingStyle(event.target.value) }/>
    <br />    
		<VsButton name={(isDrawerOpened === "ADD") ? "Add" : "Update"} onClick={addEditTeamSubmit} />
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
		<VsCancel align="right" onClick={() => setIsListDrawer("")} />
		<VsTextSearch label="Filter Player" value={searchText}
			onChange={(event) => updateFilterPlayerList(event.target.value)}
			onClear={(event) => updateFilterPlayerList("")}
		/>
		<br />
		{/*<DisplayFilter />*/}		 
		{/*<PlayerMenuItem />*/}
		<Table>
			<TableBody>
			{filterPlayerList.map( (p) => 
				<TableRow key={"PLR"+p.pid} className={gClasses.td} align="center">
					<TableCell style={{padding: "2px" }} className={gClasses.td} onClick={() => selectPlayer(p) } >{p.name} (CricData Id: {p.cricPid})</TableCell> 
						{/*<TableCell className={gClasses.td} ><VisibilityIcon className={gClasses.blue} size="small" onClick={() => handleSelectUser(m) }  /></TableCell>*/}
				</TableRow>
			)}
			</TableBody>
		</Table>
	</Drawer>
	</div>
	}
	</Container>
  </div>
  );    
}

