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
import { confirmAlert } from 'react-confirm-alert';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import VsTextSearch from "CustomComponents/VsTextSearch";
import globalStyles from "assets/globalStyles";
import sortBy from "lodash/sortBy";
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName, vsDialog } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea} from "CustomComponents/CustomComponents.js"
import {red, blue, deepOrange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"


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


export default function Team() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isListDrawer, setIsListDrawer] = useState("");
	
  const [tournamentName, setTournamentName] = useState("");
  const [teamName, setTeamName] = useState("");

	const [newPlayer, setNewPlayer] = useState(false);
  const [playerList, setPlayerList] = useState([]);
	const [allPlayerList, setAllPlayerList] = useState([]);
	const [filterPlayerList, setFilterPlayerList] = useState([]);
	const [filter, setFilter] = useState("");

	const [selPlayerName, setSelPlayerName] = useState([]);
	
	const [pid, setPid] = useState(0);
	const [playerName, setPlayerName] = useState("");
	const [role, setRole] = useState("NA");
	const [battingStyle, setBattingStyle] = useState("NA");
	const [bowlingStyle, setBowlingStyle] = useState("NA");
	
	const [cancelPlayerRec, setCancelPlayerRec] = useState({});
	const [isCancel, setIsCancel] = useState(false);
	
	const [teamData, setTeamData] = useState({});

	const [searchText, setSearchText] = useState("");

  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
			const tournament = async () => {
				try {
					let tRec = JSON.parse(sessionStorage.getItem("shareTeam"));
					setTeamData(tRec);
					setTournamentName(tRec.tournament);
					setTeamName(tRec.name);
					getTeamPlayers(tRec.tournament, tRec.name);
					getAllPlayers();
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
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/uniquelist`);
			 setAllPlayerList(resp.data);
			 setFilterPlayerList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching all player list");
			setPlayerList([]);
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
		setRole("NA");
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
	
	async function addEditTeamSubmit() {
		console.log("In addEditTeamSubmit");
		return;
		if (isDrawerOpened === "ADD") {
			try {
				// add tournament
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/add/${pid}/${playerName}/${tournamentName}/${teamName}/${role}/${battingStyle}/${bowlingStyle}`);
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
		
		setIsListDrawer("");
		setPid(pRec.pid);
		setPlayerName(pRec.name);
		setRole(pRec.role);
		setBattingStyle(pRec.battingStyle);
		setBowlingStyle(pRec.bowlingStyle);
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
						<IconButton color="primary" size="small" onClick={() => { handleEdit(t) } } >
							<EditIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
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
		<Grid container justify="center" alignItems="center" >
			<GridItem xs={6} sm={6} md={6} lg={6} >
				<VsButton name="Back" align="left" onClick={handleBack} />
			</GridItem>
			<GridItem xs={6} sm={6} md={6} lg={6} >
				<VsButton align="right" name="Add new Player" onClick={handleAdd} />
			</GridItem>
		</Grid>
	</div>
	<DisplayPlayerList />
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		<ValidatorForm className={gClasses.form}>
		<Typography className={classes.title}>{(isDrawerOpened === "ADD") ?"New Player" : "Edit Player"}</Typography>
		{(isDrawerOpened === "ADD") &&
			<VsButton name="Select Existing Player" onClick={selectExistingPlayer} />
		}
		<BlankArea />
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="Pid" 
			value={pid}
			disabled={isDrawerOpened === "EDIT"}
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
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Role" 
			value={role}
			onChange={() => { setRole(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Batting Style" 
			value={battingStyle}
			onChange={() => { setBattingStyle(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Bowling Style" 
			value={bowlingStyle}
			onChange={() => { setBowlingStyle(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
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
					<TableCell className={gClasses.td} onClick={() => selectPlayer(p) } >{p.name} (Pid: {p.pid})</TableCell> 
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

