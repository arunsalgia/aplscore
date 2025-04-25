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

export default function SU_GroupMember() {
	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	const [tournamenetRec, setTournamentRec] = useState({name: ""});
	const [groupRec, setGroupRec] = useState({name: ""});
	const [memberRec, setMemberRec] = useState({});
	const [userRec, setUserRec] = useState(null);
	const [userName, setUserName] = useState("");
	const [franchiseeName, setFranchiseeName] = useState("");
	const [memberList, setMemberList] = useState([]);
	const [userList, setUserList] = useState([]);
	const [groupOwner, setGroupOwner] = useState(false);
	
  const [groupName, setGroupName] = useState("");

  const [registerStatus, setRegisterStatus] = useState(0);

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
      const a = async (gRec) => {
        await getAllGroupMembers(gRec);
				await getAllUsers()
      }
			let tRec = JSON.parse(sessionStorage.getItem("shareTournament"));
			setTournamentRec(tRec);
			let grpRec = JSON.parse(sessionStorage.getItem("shareGroup"));
			setGroupRec(grpRec);
		  a(grpRec);
  }, [])

  async function getAllUsers() {
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/brieflist`);			
			 setUserList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching user list");
		}
	}
	
  async function getAllGroupMembers(gRec) {
		console.log(gRec);
		try {
			 let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/groupmembers/${gRec.gid}`);			
			 console.log(resp.data);
			 setMemberList(resp.data);
		} catch(e) {
			console.log(e)
			alert.error("error fetching member list");
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
      case 1000:
        myMsg = 'Duplicate user';
        break;
      case 1001:
        myMsg = 'Duplicate group owner';
        break;
      case 1002:
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


	async function addEditMemberSubmit() {
		console.log("in Create edit group");
		console.log(userRec);
		console.log(franchiseeName);
		console.log(groupOwner);		
		// Check duplicate user for Add
		var tmp = null;
		if (isDrawerOpened == "ADD") {
			// duplicate user?
			tmp = memberList.filter(x => x.uid === userRec.uid)
			if (tmp.length > 0) return setRegisterStatus(1000);
			
			// duplicate group owner
			if (groupOwner) {
				console.log("Add   --- Checkoing group owner");
				tmp = memberList.filter(x => x.uid == groupRec.owner)
				console.log(tmp);
				if (tmp.length > 0) return setRegisterStatus(1001);
			}
		}
		else {
			// duplicate group owner
			if (groupOwner) {
				console.log("Checkoing group owner");
				tmp = memberList.filter(x => x.uid == groupRec.owner)
				if (tmp.length > 0) {
					if (tmp[0].uid !== userRec.uid) {
					 setRegisterStatus(1001);
					 return;
					}
				}
			}
		}

		
		let fName = (franchiseeName != "") ? franchiseeName : userRec.displayName;
		try {
			console.log(isDrawerOpened);
      var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/${(isDrawerOpened == "ADD") ? "addgroupmember" : "updategroupmember"}/${groupRec.gid}/${userRec.uid}/${fName}/${groupOwner}`);
			var tmp = [].concat(memberList);
			if (isDrawerOpened !== "ADD")
				tmp = tmp.filter(x => x.uid !== userRec.uid);
			tmp = [resp.data].concat(tmp)
			tmp = sortBy(tmp, 'userName');
			setMemberList(tmp);
			// update group memebr
			if (groupOwner) {
				tmp = [groupRec].concat([]);
				tmp[0].owner = userRec.uid;
				setGroupRec(tmp[0]);
			}
			else if (groupRec.owner === userRec.uid) {
				tmp = [groupRec].concat([]);
				tmp[0].owner = 0;
				setGroupRec(tmp[0])			
			}
			
			alert.show("Successfully added/updated user " + userRec.displayName);
    } catch {
			alert.error("Error adding group "+userRec.displayName);
    }
		setIsDrawerOpened("");
	}
	


	async function handleAdd() {
		setRegisterStatus(0);
		setUserRec(userList[0]);
		setFranchiseeName("");
		setGroupOwner(false);
		setIsDrawerOpened("ADD");
	}
	
	async function handleEdit(t) {
		setRegisterStatus(0);
		setUserRec(t)
		setFranchiseeName(t.displayName);
		setGroupOwner(groupRec.owner === t.uid);
		setIsDrawerOpened("EDIT");
	}
	


	async function handleDeleteMember(t) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/deletegroupmember/${t.gid}/${t.uid}`);
			alert.success("Successfully removed member " + t.userName);
			setMemberList(memberList.filter(x => x.uid !== t.uid));
			if (groupRec.owner == t.uid) {
			  var tmp = [groupRec].concat([]);
				tmp[0].owner = 0;
				setGroupRec(tmp[0]);
			}
		} catch {
			alert.error("Error deleting group "+t.userName);
		}
	}
	
	function DisplayMemberList() {
	let colCount = 112;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow key="THHHHH1" align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{"Member List"}
					</TableCell>
				</TableRow>
				<TableRow key="THHHHH2" align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					UID
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Member name
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Display name
					</TableCell>
          <TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Owner
					</TableCell>
          <TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Balance Amt
					</TableCell>
 					<TableCell key={"TH30"} component="th" colSpan={3} scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{memberList.map( (t, index) => {
				let myClass = classes.tdPending;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.uid}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.userName}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.displayName}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{(t.uid == groupRec.owner) ? "Yes" : "No"}
						</Typography>
					</TableCell>
          <TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{t.balanceAmount}
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
						<VsCancel onClick={() => { handleDeleteMember(t) } } />
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
		setTab(11);
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
	
	function updateFilterUserList(textstr) {
		textstr = textstr.toLowerCase()
		setSearchText(textstr);

		if (textstr != "") {
			setFilterUserList(userList.filter(x => x.displayName.toLowerCase().includes(tmp)));
		} 
		else  {
			console.log("BLANK");
			setFilterPlayerList(userList);
		}
	}	

  return (
  <div className={classes.paper} align="center" key="groupinfo">
		<DisplayPageHeader headerName={`Members of group ${groupRec.name} (${tournamenetRec.name})`} groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<div align="right">
			<Grid container justifyContent="center" alignItems="center" >
				<GridItem xs={6} sm={6} md={6} lg={6} >
					<VsButton name="Back" align="left" onClick={handleBack} />
				</GridItem>
				<GridItem xs={6} sm={6} md={6} lg={6} >
					<VsButton name="Add new member" disabled={memberList.length >= groupRec.memberCount} align="right" onClick={handleAdd} />
				</GridItem>
			</Grid>
		</div>
		<DisplayMemberList />
		</Container>
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		<Typography style={{padding: "5px"}}>
			<span className={gClasses.info18} >{`Select user from the user master list: `}</span>
		</Typography>		
		{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
			<Grid key={"SELECTMEMBERS"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px" }}  item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.info18Blue} >User name</Typography>
				</Grid>
				<Grid item xs={8} sm={8} md={8} lg={8} >
					{(isDrawerOpened === "ADD") &&
					<Autocomplete
						disablePortal
						id="HODNAME"
						value={userRec}
						onChange={(event, values) => setUserRec(values) }
						style={{paddingTop: "10px" }}
						getOptionLabel={(option) => option.displayName || ""}
						options={userList}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} />}
					/>
					}
					{(isDrawerOpened !== "ADD") &&
						<Typography className={gClasses.info18} >{userRec.userName}</Typography>
					}				
				</Grid>
				<Grid style={{marginTop: "10px" }}  item xs={12} sm={12} md={12} lg={12} />
				
				<Grid style={{marginTop: "10px" }}  item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.info18Blue} >Group owner</Typography>
				</Grid>
				<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
					<VsCheckBox checked={groupOwner} align="left" onClick={() => setGroupOwner(event.target.checked) }  />
				</Grid>
				<Grid style={{marginTop: "10px" }}  item xs={12} sm={12} md={12} lg={12} />

				<Grid style={{marginTop: "15px" }}  item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.info18Blue} >FranchiseName</Typography>
				</Grid>
				<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
					<TextField required id="filled-required" value={franchiseeName}  onChange={(event, values) => setFranchiseeName(event.target.value) }
        />
				</Grid>
				<Grid  item xs={12} sm={12} md={12} lg={12} >
					<ShowRegisterStatus />
				</Grid>
				<Grid style={{marginTop: "10px" }}  item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{marginTop: "10px" }}  item xs={12} sm={12} md={12} lg={12} >
					<VsButton type="submit" align="center" name={(isDrawerOpened === "ADD")  ? "Add User": "Update User"} onClick={addEditMemberSubmit} />
				</Grid>
			</Grid>		
		}
		</Box>
		</Drawer>
	</div>
  );    
}

