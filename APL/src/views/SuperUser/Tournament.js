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
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
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


export default function SU_Tournament() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [newTournament, setNewTournament] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentList, setTournamentList] = useState([]);
  const [tournamentType, setTournamentType] = useState("T20");
  const [tournamentDesc, setTournamentDesc] = useState("");
  const [tournamentData, setTournamentData] = useState(["T20", "ODI", "TEST"]);
  const [teamList, setTeamList] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [labelNumber, setLabelNumber] = useState(0);
  const [newTeamList, setNewTeamList] = useState([]);
    // {label: "TEAM1", existingTeam: true, name: "INDIA"},
    // {label: "TEAM2", existingTeam: true, name: "ENGLAND"},
    // // {label: "TEAM3", existingTeam: false, name: ""},
    // ]);
  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
      const a = async () => {
        var teamres = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/uniquelist/`);
        setTeamList(teamres.data);
      }
			const tournament = async () => {
				getAllTournament();
			}
      //a();
			tournament();
  }, [])

	async function getAllTournament() {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list`);
			 setTournamentList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching tournament list");
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
    <Avatar variant="square" src={myTeam} className={classes.medium} />    
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

  function handleTeamSelect(label, newName) {
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

  function handleTeamValidator(label, newName) {
    // console.log(`${label}  ${newName}`)
    let clone = [].concat(newTeamList);
    let tmp = clone.find(x => x.label === label);
    tmp.name = newName.toUpper();
    setNewTeamList(clone);
  }

  function setTeamName(label) {
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
        onChange={(event) => handleTeamSelect(props.myTeam.label, event.target.value)}
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
      //   onChange={(event) => handleTeamSelect(props.myTeam.label, event.target.value)}
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
      //setTeamList([]);
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
		setTournamentName("");
		setTournamentDesc("")
		setTournamentType("")
		setIsDrawerOpened("ADD");
	}
	
	async function handleEdit(t) {
		setTournamentName(t.name);
		setTournamentDesc(t.desc)
		setTournamentType(t.type)
		setIsDrawerOpened("EDIT");
	}
	
	async function addEditTournamentSubmit() {
		if (isDrawerOpened === "ADD") {
			try {
				// add tournament
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/add/${tournamentName}/${tournamentDesc}/${tournamentType}`);
				alert.show("Successfully added tournament "+tournamentName);
				let tmpArray = [resp.data].concat(tournamentList);
				tmpArray = sortBy(tmpArray, 'name');
				setTournamentList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error adding tournament "+tournamentName);
			}
		} else if (isDrawerOpened === "EDIT") {
			try {
				// add tournament
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/update/${tournamentName}/${tournamentDesc}/${tournamentType}`);
				alert.show("Successfully updated details of tournament "+tournamentName);
	
				let tmpArray = tournamentList.filter(x => x.name !== resp.data.name);
				tmpArray.push(resp.data);
				tmpArray = sortBy(tmpArray, 'name');
				setTournamentList(tmpArray);
				setIsDrawerOpened("")
			} catch {
				alert.error("Error updating details of tournament "+tournamentName);
			}
		}

	}
	
	function handleTeam(t) {
		sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(2);
	}
	
	function handlePlayerInfo(t) {
		sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(6);
	}
	function handleMatch(t) {
		sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(4);
	}
	
	async function handleCancel(t) {
		try {
			// add tournament
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/count/tournament/${t.name}`);
			if (resp.data.count > 0) {
				alert.error("Cannot delete tournament "+t.name+". Delete teams first");
				return;
			}
			// nor delete
			resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/delete/${t.name}`);
			alert.success("Successfully removed tournament "+t.name);
			let tmpArray = tournamentList.filter(x => x.name !== t.name);
			setTournamentList(tmpArray);
		} catch {
			alert.error("Error adding tournament "+tournamentName);
		}
	}
	
	function DisplayTournamentList() {
	let colCount = 7;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{"Tournament List"}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Desc
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Type
					</TableCell>
					<TableCell key={"TH31"} component="th" colSpan={5} scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{tournamentList.map( (t, index) => {
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.name}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.desc}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.type}
						</Typography>
					</TableCell>
					<TableCell key={"TD10"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => { handleTeam(t);}}>Team</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => { handleMatch(t);}}>Match</Link>
					</Typography>
					</TableCell>	
					<TableCell key={"TD14"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => { handlePlayerInfo(t);}}>PlayerInfo</Link>
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
	

	
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
	<DisplayPageHeader headerName="Configure Tournaments" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<VsButton name="Add new tournament" align="right" onClick={handleAdd} />
	<DisplayTournamentList />
	<Drawer className={classes.drawer}
		anchor="top"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		<ValidatorForm className={gClasses.form} onSubmit={addEditTournamentSubmit}>
		<Grid key="ADDEDIT" container justify="center" alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<Typography className={classes.title}>{(isDrawerOpened === "ADD") ?"New Tournament" : "Edit Tournament"}</Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Tournament Name" 
			value={tournamentName}
			disabled={isDrawerOpened === "EDIT"}
			onChange={() => { setTournamentName(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Tournament description" 
			value={tournamentDesc}
			onChange={() => { setTournamentDesc(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted', ]}
		/>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<Select labelId='team' id='team' variant="outlined" required fullWidth label="Tournament type"
        value={tournamentType}
        onChange={(event) => setTournamentType(event.target.value)}
			>
			{tournamentData.map(x =>
        <MenuItem key={x} value={x}>{x}</MenuItem>)
			}
      </Select>
		</Grid>
		<Grid item xs={1} sm={1} md={1} lg={1} >
			<VsButton name={(isDrawerOpened === "ADD") ? "Add" : "Update"} />
		</Grid>
		</Grid>
		<ValidComp />
		</ValidatorForm>
		</div>
	}
	</Drawer>
	</Container>
  </div>
  );    
}

