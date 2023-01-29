import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
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
import globalStyles from "assets/globalStyles";
import sortBy from "lodash/sortBy";
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

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


let searchText = "";
function setSearchText(sss) { searchText = sss;}

export default function PlayerInfo() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isListDrawer, setIsListDrawer] = useState("");
	
  const [tournamentName, setTournamentName] = useState("");
  const [teamName, setTeamName] = useState("");

	const [newPlayer, setNewPlayer] = useState(false);
  const [playerList, setPlayerList] = useState([]);
	const [masterPlayerList, setMasterPlayerList] = useState([]);
	const [selPlayerName, setSelPlayerName] = useState([]);
	
	const [pid, setPid] = useState(0);
	const [playerName, setPlayerName] = useState("");
	const [role, setRole] = useState("NA");
	const [battingStyle, setBattingStyle] = useState("NA");
	const [bowlingStyle, setBowlingStyle] = useState("NA");
	
	const [cancelPlayerRec, setCancelPlayerRec] = useState({});
	const [isCancel, setIsCancel] = useState(false);
	
	const [teamData, setTeamData] = useState({});
  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
			const tournament = async () => {
				try {
					let tRec = JSON.parse(sessionStorage.getItem("shareTournament"));
					//console.log(tRec);
					setTournamentName(tRec.name);
					getAllPlayers(tRec.name);
				} catch (e) {
					alert.error("Tournament name not specified");
				}
			}
			tournament();
  }, [])


	
	async function getAllPlayers(tournament) {
		//console.log("Get players of "+tournament);
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/player/tournament/${tournament}`);
			 setPlayerList(resp.data);
			 setMasterPlayerList(resp.data);
			 //console.log(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching all player list");
			setPlayerList([]);
			setMasterPlayerList([]);
		}
	}
	
	

  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };


	function DisplayPlayerList() {
	let colCount = 5;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{`Players playing in tournament ${tournamentName})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Team
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
				</TableRow>
			</TableHead>
			<TableBody>  
			{playerList.map( (t, index) => {
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.name}
						</Typography>
					</TableCell>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.Team}
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
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	
	function filterPlayers(txt) {
		setPlayerList(masterPlayerList.filter(x => x.name.toLowerCase().includes(txt.toLowerCase())));
		setSearchText(txt);
	}
	
	function handleBack() {
		//sessionStorage.setItem("shareTournament", JSON.stringify(t));
		setTab(1);
	}
  return (
  <div className={classes.paper} align="center" key="groupinfo">
	<DisplayPageHeader headerName={`Player information of Tournament: ${tournamentName}`} groupName="" tournament=""/>
	<Container component="main" maxWidth="md">
	<CssBaseline />
	<div>
	<VsButton name="Back" align="right" onClick={handleBack} />
	<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
		<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
		<Grid key={"F2"} item xs={12} sm={12} md={6} lg={6} >
		<TextField id="filter"  padding={5} fullWidth label="Filter players by name" 
			defaultValue={searchText}
			onChange={(event) => filterPlayers(event.target.value)}
			InputProps={{endAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>)}}
		/>
		</Grid>
		<Grid key={"F6"} item xs={false} sm={false} md={4} lg={4} />
	</Grid>
	<DisplayPlayerList />
	</div>
	</Container>
  </div>
  );    
}

