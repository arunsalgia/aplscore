import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch";
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

import VsCheckBox from "CustomComponents/VsCheckBox";

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
        color: '#D812315',
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
          color: '#12CC1217',
          fontSize: 12,
          // backgroundColor: green[700],
    },
    symbolText: {
        color: '#12CC1217',
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


const AuctionStatusList = ['PENDING', 'OVER'];

const BlankStyle={marginTop: "15px"};

export default function SU_Group() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
  const [tournamentList, setTournamentList] = useState([]);
  const [groupList, setGroupList] = useState([]);
	const [newGroup, setNewGroup] = useState(false);
  const [ownerNames, setOwnweNames] = useState([]);

	const [tournamenetRec, setTournamentRec] = useState({name: ""});
	const [onlyCurrent, setOnlyCurrent] = useState(false);
	const [unsoldPlayerType, setSoldPlayerType] = useState(true);
	const [currentGroup, setCurrentGroup] = useState(null);
	
	
  const [groupName, setGroupName] = useState("");
	const [groupGid, setGroupGid] = useState(0);
  const [tournamentName, setTournamentName] = useState("");
  const [auctionStatus, setAuctionStatus] = useState(AuctionStatusList[0]);
  const [memberCount, setMemberCount] = useState(6);
  const [memberFee, setMemberFee] = useState(500);
  const [bidAmount, setBidAmount] = useState("200");
  const [prizeCount, setPrizeCount] = useState(1);
	const [maxAutionPlayers, setMaxAutionPlayers] = useState(25);
	const [maxAutionCoins, setMaxAutionCoins] = useState(2000);

  const [tournamentType, setTournamentType] = useState("T20");
  const [tournamentDesc, setTournamentDesc] = useState("");
  const [tournamentData, setTournamentData] = useState(["T20", "ODI", "TEST"]);
  const [teamList, setTeamList] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [labelNumber, setLabelNumber] = useState(0);
  const [newTeamList, setNewTeamList] = useState([]);
	
	const [soldPlayers, setSoldPlayers] = useState([]);
	const [unsoldPlayers, setUnsoldPlayers] = useState([]);
	const [playerList, setPlayerList] = useState([]);
	const [playerType, setPlayerType] = useState("UNSOLDPLAYERS");
	const [playerRec, setPlayerRec] = useState({name: ""});
	const [memberRec, setMemberRec] = useState({});
	const [memberList, setMemberList] = useState([]);
	const [cbArray, setCbArray] = useState(Array(100).fill(""));
	const [selectedFranchisee, setSelectedFranchisee] = useState("");
		// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };
	
	
    // {label: "TEAM1", existingTeam: true, name: "INDIA"},
    // {label: "TEAM2", existingTeam: true, name: "ENGLAND"},
    // // {label: "TEAM3", existingTeam: false, name: ""},
    // ]);
  const classes = useStyles();
	const gClasses = globalStyles();
	
  const alert = useAlert();
	
  useEffect(() => {
      const a = async (tRec) => {
        //await getAllTournament();
        await getAllGroup(tRec.name);
        await getAllGroupOwnerNames();
      }
			
			let tRec = JSON.parse(sessionStorage.getItem("shareTournament"));
			setTournamentRec(tRec);
			
		  a(tRec);
  }, [])


  async function getAllGroup(tName) {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getgroupbytournament/${tName}`);			
			 console.log(resp.data);
			 setGroupList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching group list");
		}
	}

	async function getAllGroupOwnerNames() {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/ownernames`);
			 setOwnweNames(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching group owner name list");
		}
	}
	

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


 function ShowRegisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = 'Player not selected';
        break;
      case 1002:
        myMsg = 'no franchisee(s) selected';
        break;
      case 1003:
        myMsg = 'Error adding player';
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

      
  async function handleSubmit() {
		console.log("Hello");
		console.log(playerRec);
		if (!playerRec) {
			setRegisterStatus(1001);
			return;
		}
		
		if (playerRec.name == "") {
			setRegisterStatus(1001);
			return;
		}

		if (selectedFranchisee === "") {
			setRegisterStatus(1002);
			return;
		}
		
		console.log("All fine");
		
		let tmpArray = [];
		for (var i=0; i< cbArray.length; ++i) {
			console.log(memberRec[i]);
			if (cbArray[i] !== "")  tmpArray.push(memberList[i].uid.toString());
		}
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/addplayer/${tournamenetRec.name}/${currentGroup.gid}/${playerRec.cricPid}/${tmpArray}`
		console.log(myUrl);
		tmpArray = cbArray.filter(x => x !== "");
		try {
			await axios.get(myUrl);
			setIsDrawerOpened("");
			alert.success(`Successfully added player  ${playerRec.name} to franchisee ${tmpArray.join(", ")}`);
		}
		catch(e) {
		  setRegisterStatus(1003);	
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
    setGroupList(resp.data);
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

	async function addEditgroupSubmit() {
		console.log("in Create edit group");
		try {
      // add tournament
      var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/${(isDrawerOpened == "ADD") ? "createspecial" : "updatespecial"}/${groupGid}/${tournamenetRec.name}/${groupName}/${memberCount}/${maxAutionCoins}/${maxAutionPlayers}`);
			let tmp = [].concat(groupList);
			if (isDrawerOpened != "ADD")
				tmp = tmp.filter(x => x.gid != groupGid);
			console.log(tmp);
			console.log(resp.data);
			// now add group returnsd from backend
			tmp = [resp.data].concat(tmp);
			console.log(tmp);
			setGroupList(sortBy(tmp, 'name'));
			alert.show("Successfully added/updated group "+groupName);
    } catch {
			alert.error("Error adding group "+groupName);
    }
		setIsDrawerOpened("");
	}
	


	async function handleAdd() {
		setGroupName("");
		setGroupGid(0);
		setIsDrawerOpened("ADD");
	}
	
	async function handleEdit(t) {
		//console.log(t);
		setGroupGid(t.gid);
		setGroupName(t.name);
		setMemberCount(t.memberCount)
		setMaxAutionCoins(t.maxBidAmount)
		setMaxAutionPlayers(t.maxPlayers)
		setIsDrawerOpened("EDIT");
	}
	


	async function handleDeleteGroup(t) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/deletespecial/${t.gid}`);
			alert.success("Successfully removed group " + t.name);
			setGroupList(groupList.filter(x => x.name !== t.name));
		} catch {
			alert.error("Error deleting group "+t.name);
		}
	}
	
	function DisplayGroupList() {
	let colCount = 112;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow key="THHHHH1" align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{"Group List"}
					</TableCell>
				</TableRow>
				<TableRow key="THHHHH2" align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					GID
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Owner
					</TableCell>
          {/*<TableCell key={"TH212"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Tournamenet
					</TableCell>*/}
          <TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Auct.Sts.
					</TableCell>
          <TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Mem.Count
					</TableCell>
          <TableCell key={"TH27"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Fee
					</TableCell>
          <TableCell key={"TH28"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Auc. coins
					</TableCell>
          <TableCell key={"TH41"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Auc. players
					</TableCell>
          <TableCell key={"TH29"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					MaxPrize
					</TableCell>
					<TableCell key={"TH30"} component="th" colSpan={3} scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{groupList.map( (t, index) => {
				let myClass = classes.tdPending;
        let tmp = ownerNames.find(x => x.uid === t.owner);
        let myName = (tmp != null) ? tmp.displayName : "---";
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.gid}
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
							{myName}
						</Typography>
					</TableCell>
          {/*<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.tournament}
						</Typography>
					</TableCell>*/}
          <TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.auctionStatus}
						</Typography>
					</TableCell>
          <TableCell key={"TD6"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.memberCount}
						</Typography>
					</TableCell>
          <TableCell key={"TD7"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.memberFee}
						</Typography>
					</TableCell>
          <TableCell key={"TD8"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.maxBidAmount}
						</Typography>
					</TableCell>
           <TableCell key={"TD114"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.maxPlayers}
						</Typography>
					</TableCell>
         <TableCell key={"TD9"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.prizeCount}
						</Typography>
					</TableCell>
					<TableCell key={"TD112"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => { handleGroupMember(t);}}>Members</Link>
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
						<VsCancel onClick={() => { handleDeleteGroup(t) } } />
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	

	function handleBack() {
		//sessionStorage.setItem("shareTournament", JSON.stringify(t));
		console.log("back to group");
		setTab(11);
	}
	
	function handleGroupMember(grpRec) {
		sessionStorage.setItem("shareGroup", JSON.stringify(grpRec));
		setTab(12);
	}
	
	function handleSelectMemberCb(idx) {
		var tmpArray = [].concat(cbArray);
		if (tmpArray[idx] === "") {
			tmpArray[idx] = memberList[idx].userName;
		}
		else
			tmpArray[idx] = "";
		setCbArray(tmpArray);
		
		tmpArray = tmpArray.filter( x => x != "");
		setSelectedFranchisee(tmpArray.join(", "));
	}
	
	

  return (
  <div className={classes.paper} align="center" key="groupinfo">
	<DisplayPageHeader headerName={`Groups of tournament ${tournamenetRec.name}`} groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<div align="right">
		<Grid container justifyContent="center" alignItems="center" >
			<GridItem xs={6} sm={6} md={6} lg={6} >
				<VsButton name="Back" align="left" onClick={handleBack} />
			</GridItem>
			<GridItem xs={6} sm={6} md={6} lg={6} >
	<VsButton name="Add new Group" align="right" onClick={handleAdd} />
			</GridItem>
		</Grid>
	</div>
	<DisplayGroupList />
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<div align="center">
		<ValidatorForm className={gClasses.form} onSubmit={addEditgroupSubmit}>
		<Grid key="ADDEDIT" container justifyContent="center" alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<Typography className={classes.title}>{(isDrawerOpened === "ADD") ?"New Group" : "Edit Group"}</Typography>
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Tournament Name" 
			defaultValue={tournamenetRec.name}
			disabled={true}
			onChange={() => { setTournamentName(event.target.value) }}
		/>
		</Grid>
		<Grid style={BlankStyle} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing}
			label="Group name" 
			value={groupName}
			onChange={() => { setGroupName(event.target.value) }}
		/>
		</Grid>
		<Grid style={BlankStyle} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing} type="number"
			label="Number of members in group" 
			value={memberCount}
			onChange={() => { setMemberCount(event.target.value) }}
		/>
		</Grid>
		<Grid style={BlankStyle} item xs={12} sm={12} md={12} lg={12} />
		
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing} type="number"
			label="Auction Coins available" 
			value={maxAutionCoins}
			onChange={() => { setMaxAutionCoins(event.target.value) }}
		/>
		</Grid>
		<Grid style={BlankStyle} item xs={12} sm={12} md={12} lg={12} />

		<Grid item xs={12} sm={12} md={12} lg={12} >
		<TextValidator fullWidth  required className={gClasses.vgSpacing} type="number"
			label="Maximum players available in Auction" 
			value={maxAutionPlayers}
			onChange={() => { setMaxAutionPlayers(event.target.value) }}
		/>
		</Grid>
		<Grid style={BlankStyle} item xs={12} sm={12} md={12} lg={12} />

		<br />
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<VsButton type="submit" name={(isDrawerOpened === "ADD") ? "Add" : "Update"} />
		</Grid>
		</Grid>
		<ValidComp />
		</ValidatorForm>
		</div>
	}
	{(isDrawerOpened === "ADDPLAYER") &&
	<div align="center">
		<Typography className={classes.title}>Add Player to Franchisee</Typography>
		<Typography className={classes.title}>(Group: {currentGroup.name})</Typography>
		<br />
		<Accordion expanded={expandedPanel === "selectplayer"} onChange={handleAccordionChange("selectplayer")}>
			<Box align="right" className={(expandedPanel === "selectplayer") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Player to be added " + ((playerRec) ? playerRec.name : "")}</Typography>
			</AccordionSummary>
			</Box>
		<Grid className={gClasses.noPadding} key="ALLGROUP" container align="center">
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{marginTop: "10px"  }} className={gClasses.info18}>{`Sold Players`}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Switch color="primary" checked={playerType === "UNSOLDPLAYERS"} onChange={() => changePlayerType(playerType)} />
			</Grid>
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{marginTop: "10px"  }} className={gClasses.info18}>{`Unsold Players`}</Typography>
			</Grid>
			<br />
			<br />
			<Grid item xs={3} sm={3} md={3} lg={3} >
				<Typography style={{marginTop: "10px"  }} className={gClasses.info18}>Player</Typography>
			</Grid>			
			<Grid item xs={9} sm={9} md={9} lg={9} >
				<Autocomplete
					disablePortal
					id="PLAYERREC"
					onChange={(event, values) => setPlayerRec(values) }
					style={{paddingTop: "10px" }}
					getOptionLabel={(option) => option.name || ""}
					options={(playerType !== "SOLDPLAYERS") ? soldPlayers : unsoldPlayers}
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} />}
				/>
			</Grid>
			<Grid style={{marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>	
		</Accordion>
		<br />
		<br />
		<Accordion expanded={expandedPanel === "selectfranchisee"} onChange={handleAccordionChange("selectfranchisee")}>
			<Box align="right" className={(expandedPanel === "selectfranchisee") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Bid amount "+bidAmount}</Typography>
			</AccordionSummary>
			</Box>
			<Grid className={gClasses.noPadding} key="ALLGROUP" container align="center">
				<Grid style={{marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12} />				
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<Typography style={{marginTop: "10px"  }} className={gClasses.info18}>Bid Amount</Typography>
				</Grid>		
				<Grid item xs={3} sm={3} md={3} lg={3} />				
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<TextField  fullWidth className={gClasses.vgSpacing}
						value={bidAmount} onChange={(event) => { setBidAmount(event.target.value) }}			
					/>
				</Grid>
				<Grid style={{marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>	
		</Accordion>
		<br />
		<br />
		<Accordion expanded={expandedPanel === "selectbidamount"} onChange={handleAccordionChange("selectbidamount")}>
			<Box align="right" className={(expandedPanel === "selectbidamount") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Selected franchisee "+selectedFranchisee}</Typography>
			</AccordionSummary>
			</Box>
			{memberList.map( (m, index) => {
				return (
					<Grid key={"SELECTMEMBERS"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
						<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.userName}</Typography>
					</Grid>	
					<Grid item xs={2} sm={2} md={2} lg={2} >
						<VsCheckBox checked={cbArray[index] !== ""} onClick={() => handleSelectMemberCb(index) }  />
					</Grid>
					</Grid>	
				)}
			)}
		</Accordion>
		<br />
		<ShowRegisterStatus />
		<br />
		<br />
		<VsButton align="center" name="Submit" onClick={handleSubmit} />
		
	</div>
	}
	</Box>
	</Container>
	</Drawer>
	</Container>
  </div>
  );    
}

