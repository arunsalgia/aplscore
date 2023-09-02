import React, { useEffect, useState, useContext } from 'react';
import { spacing } from '@material-ui/system';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
// import Table from "components/Table/Table.js";
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { UserContext } from "../../UserContext";
import { DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { clearBackupData, hasGroup, upGradeRequired, downloadApk } from 'views/functions';
import { red, blue, deepOrange } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions";
import CardFooter from "components/Card/CardFooter.js";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {setTab} from "CustomComponents/CricDreamTabs.js"
import Divider from '@material-ui/core/Divider';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';


// import NEWTOURNAMENTIMAGE from `${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG`;

const cardStyles = {
  cardImage: {
      // backgroundImage: `url(${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG)`,
      height: '20px'
  }
};

// const customStyles = {
//   content : {
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     transform             : 'translate(-50%, -50%)',
//     backgroundColor       : '#000000',
//     color                 : '#FFFFFF',
//   }
// };


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      // backgroundColor: '#84FFFF'
      // backgroundColor: '#A1887F'
    },
    withTopSpacing: {
      marginTop: theme.spacing(1),
    },
    jumpButton: {
      marginTop: theme.spacing(1),
      backgroundColor: '#FFFFFF',
      color: deepOrange[700],
      fontWeight: theme.typography.fontWeightBold,
      fontSize: '16px',
      width: theme.spacing(40),
    },
  
    dashButton: {
      // marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    new: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: theme.typography.fontWeightBold,
      color: '#FFFFFF'
    },
    whatIsNew: {
      backgroundColor: '#B3E5FC',
      color: '#000000',
      fontWeight: theme.typography.fontWeightBold,
    },  
    ngCard: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightBold,
      color: deepOrange[900],
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
    groupName:  {
      // right: 0,
      fontSize: '16px',
      fontWeight: theme.typography.fontWeightBold,
      color: deepOrange[700],
      alignItems: 'center',
      marginTop: '0px',
    },
    error:  {
        // right: 0,
        fontSize: '12px',
        color: red[700],
        alignItems: 'center',
        marginTop: '0px',
    },
    updatemsg:  {
        // right: 0,
        fontSize: '12px',
        color: blue[700],
        // position: 'absolute',
        alignItems: 'center',
        marginTop: '0px',
    },
    hdrText:  {
        // right: 0,
        // fontSize: '12px',
        // color: red[700],
        // // position: 'absolute',
        align: 'center',
        marginTop: '0px',
        marginBottom: '0px',
    },

    }));



export default function Home() {
    // const { setUser } = useContext(UserContext);
    // window.onbeforeunload = () => setUser("")
    const classes = useStyles();
    const [tournamentList, setTournamentList] = useState([]);
    const [registerStatus, setRegisterStatus] = useState(0);
    const [currentTournament, setCurrentTournament] = useState(0);
    const [upgrade, setUpgrade] = React.useState(false);
    const [modalIsOpen,setIsOpen] = React.useState(true);
    const [latestApk, setLatestApk] = React.useState(null);

    const [userGroup, setUserGroup] = React.useState([]);
    const [noGroup, setNoGroup] = React.useState(true);
    const [currentGroup, setCurrentGroup] = useState(0);

    useEffect(() => {
      const checkVersion = async () => {
        //console.log("about to call upgrade");
        let upg = await upGradeRequired();
        // console.log(upg);
        if (upg.latest) setLatestApk(upg.latest);
  
        setUpgrade(upg.status);
        if (upg.status) setIsOpen(true);
      }
      const a = async () => {
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list/notstarted`); 
        setTournamentList(response.data);
        if (response.data.length > 0) {
          setCurrentTournament(0);
        }
      }
      const getGroups = async () => {

        if (!hasGroup()) return;

        let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
        axios.get(myUrl).then((response) => {
          let allGroups = response.data[0].groups;
          if (allGroups.length > 0) {
            let tmp = allGroups.find(x => x.defaultGroup == true);
            if (!tmp) {
              tmp = allGroups[0];
              tmp.defaultGroup = true;
              localStorage.setItem("gid", tmp.gid.toString());
              localStorage.setItem("groupName", tmp.groupName);
              localStorage.setItem("tournament", tmp.tournament);
              localStorage.setItem("admin", tmp.admin);
              clearBackupData();
            }
          }
          setUserGroup(allGroups);
          setNoGroup(false);
        }).catch((error) => {
          console.log('Not good man :(');
          console.log(error);
        })        
      }
      a();
      getGroups();
      checkVersion();
    }, [])

    function ShowResisterStatus() {
        // console.log(`Status is ${registerStatus}`);
        let myMsg;
        let errmsg = true;
        switch (registerStatus) { 
          case 200:
            myMsg = "Successfully updated Captain / ViceCaptain details";
            errmsg = false;
            break;
          case 0:
            myMsg = "";
            errmsg = false;
            break;
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
        let myClass = (errmsg) ? classes.error : classes.nonerror;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
    }
    
    function handleCreate() {
      // console.log(currentTournament);
      // console.log(tournamentList[currentTournament]);
      localStorage.setItem("cGroup", tournamentList[currentTournament].name);
      setTab(process.env.REACT_APP_GROUPNEW);
    }

    function handleJoin() {
      //console.log("Join group");
      setTab(process.env.REACT_APP_GROUPJOIN);
    }

    function handleLeft() {
      let newLeft = currentTournament - 1;
      if (newLeft < 0) newLeft = tournamentList.length - 1
      setCurrentTournament(newLeft);
    }

    function handleRight() {
      let newRight = currentTournament + 1;
      if (newRight >= tournamentList.length)
        newRight = 0;
      setCurrentTournament(newRight);
    }

    function ShowTournamentCards() {
      if (tournamentList.length === 0) return null;

      let tmp = tournamentList[currentTournament];
      return (
        <Box paddingLeft={0} paddingRight={0} borderColor="primary" border={1}>
      <Card m={2} raised variant="outlined">
      <CardContent style={cardStyles.cardImage} >
      <Grid key="gr-groupname" container justify="center" alignItems="center" >
        <Grid item xs={2} sm={2} md={2} lg={2} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleLeft}
              // disabled={currentTournament === 0}
              aria-label="left" color="primary">
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
        </Grid>
        <Grid align="center" item xs={8} sm={8} md={8} lg={8} >
          <Typography className={classes.ngCard} align="center">{tmp.name}</Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleRight}
                // disabled={currentTournament === (tournamentList.length-1)}
                aria-label="right" color="primary">
                <ArrowRightIcon fontSize="large" />
              </IconButton>
        </Grid>
      </Grid>
      </CardContent>
      <CardActions>
      <Grid key="gr-group" container justify="center" alignItems="center" >
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button  
            align="left"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleCreate}>
            New Group
          </Button>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} />
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button 
            align="right"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleJoin}>
            Join Group
          </Button>
        </Grid>
      </Grid>
      </CardActions>
      </Card>
      </Box>
      )
    }

    function handlePrevGroup() {
      let newLeft = currentGroup - 1;
      if (newLeft < 0) newLeft = userGroup.length - 1
      setCurrentGroup(newLeft);
    }

    function handleNextGroup() {
      let newRight = currentGroup + 1;
      if (newRight >= userGroup.length)
        newRight = 0;
      setCurrentGroup(newRight);
    }

    async function handleGroupSelect() {
      let gRec = userGroup[currentGroup];
      try {
        await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`);
        localStorage.setItem("gid", gRec.gid);
        localStorage.setItem("groupName", gRec.groupName);
        localStorage.setItem("tournament", gRec.tournament);
        localStorage.setItem("admin", gRec.admin);
        clearBackupData();
        setTab(process.env.REACT_APP_DASHBOARD);
        // cdRefresh();
      } catch (e) {
        console.log(e);
        console.log("error setting default group");
      }
    }

    function OrgShowGroupCards() {
      if (userGroup.length <= 0) return null;

      let tmp = userGroup[currentGroup];
      return (
        <div align="center">
        <Typography align="center" component="h1" variant="h5">Select Group</Typography>
        <Box paddingLeft={0} paddingRight={0} borderColor="primary" border={1}>
        {/* <BlankArea /> */}
        <Card m={2} raised variant="outlined">
        <CardContent style={cardStyles.cardImage} >
        <Grid key="gr-groupname" container justify="center" alignItems="center" >
          <Grid item xs={1} sm={1} md={1} lg={1} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handlePrevGroup}
              // disabled={currentTournament === 0}
              aria-label="left" color="primary">
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
        </Grid>
          <Grid align="center" item xs={10} sm={10} md={10} lg={10} >
            <Button variant="outlined" size="medium" color="primary"
              className={classes.jumpButton}
              onClick={handleGroupSelect}>
              {tmp.groupName}
            </Button>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleNextGroup}
                // disabled={currentTournament === (tournamentList.length-1)}
                aria-label="right" color="primary">
                <ArrowRightIcon fontSize="large" />
              </IconButton>
        </Grid>
        </Grid>
        </CardContent>
        </Card>
        </Box>
        </div>
      )
    }

    function ShowGroupCards() {
      if (noGroup) return null;

      let tmp = userGroup[currentGroup];
      return (
      <Box className={classes.withTopSpacing} paddingLeft={0} paddingRight={0} borderColor="primary" border={1}>
        <Card m={2} raised variant="outlined">
          <CardContent style={cardStyles.cardImage} >
            <Grid key="gr-groupname" container justify="center" alignItems="center" >
              <Grid item xs={2} sm={2} md={2} lg={2} >
              <IconButton 
                    // iconStyle={{width: '24px', height: '24px'}}
                    onClick={handlePrevGroup}
                    // disabled={currentTournament === 0}
                    aria-label="left" color="primary">
                    <ArrowLeftIcon fontSize="large" />
                  </IconButton>
              </Grid>
              <Grid align="center" item xs={8} sm={8} md={8} lg={8} >
                <Typography className={classes.ngCard} align="center">{tmp.groupName}</Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} >
              <IconButton 
                    // iconStyle={{width: '24px', height: '24px'}}
                    onClick={handleNextGroup}
                      // disabled={currentTournament === (tournamentList.length-1)}
                      aria-label="right" color="primary">
                      <ArrowRightIcon fontSize="large" />
                    </IconButton>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid key="gr-groupbutton" container justify="center" alignItems="center" >
              {/* <Grid item xs={3} sm={3} md={4} lg={4} /> */}
              <Grid align="center" item >
              <Button  
                variant="contained"
                size="small" color="primary"
                className={classes.submit}
                onClick={handleGroupSelect}>
                Select Group
              </Button>
              </Grid>
              {/* <Grid item xs={4} sm={4} md={4} lg={4} /> */}
            </Grid>
            <div align="center">
            </div>
          </CardActions>
        </Card>
      </Box>
      )
    }

    function ShowCurrentGroup() {
      if (noGroup) {
        return (
          <div align='center'>
          <Typography className={classes.withTopSpacing} component="h1" variant="h5">Create new Group from Upcoming tournament</Typography>
          </div>
        )
      } else {
        return (
          <div align="center">
          <Typography className={classes.withTopSpacing} component="h1" variant="h5">Current Group</Typography>
          <Typography className={classes.groupName}>{localStorage.getItem("groupName")}</Typography>
          </div>
        )
      }
    }

    function ShowJumpButtons() {
      return (
        <div>
          <Grid key="jp1" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
              <JumpButton page={process.env.REACT_APP_HOWTOPLAY} text="How to Play" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
              <JumpButton page={process.env.REACT_APP_POINTSYSTEM} text="Point System" />
            </Grid>
          </Grid>
          <ShowCurrentGroup />
          <Grid key="jp2" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_DASHBOARD} disabled={noGroup} text="DashBoard" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_STAT} disabled={noGroup} text="Statistics" />
            </Grid>
          </Grid>
          <Grid key="jp3" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_CAPTAIN} disabled={noGroup} text="Captain" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_TEAM} disabled={noGroup} text="My Team" />
            </Grid>
          </Grid>
          <Grid key="jp4" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_GROUPDETAILS} disabled={noGroup} text="GroupDetails" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_PLAYERINFO} disabled={false} text="Player Info" />
          </Grid>
          </Grid>
          <Grid key="jp5" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_AUCTION} disabled={noGroup} text="Auction" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
            <JumpButton page={process.env.REACT_APP_MATCH} disabled={noGroup} text="Match" />
          </Grid>
          </Grid>
        </div>
      )
    }
  
    async function handleUpgrade() {
      //console.log("upgrade requested");
      closeModal();
      await downloadApk();
      console.log("APK has to be downloaded");
    }
  
    function openModal() { setIsOpen(true); }
   
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      //subtitle.style.color = '#f00';
    }
   
    function closeModal(){ setIsOpen(false); }
  
    function DisplayUpgrade() {
      //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
      if (upgrade)
        return(
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
          <Typography className={classes.new} align="center">
            Latest Version {latestApk.version}
          </Typography>
          <BlankArea/>
          <Typography className={classes.new} align="center">
            What is new
          </Typography>
          <TextField variant="outlined" multiline fullWidth disabled
            id="producttext"
            // label="What is new" 
            className={classes.whatIsNew}
            defaultValue={latestApk.text} 
          />
          <BlankArea />
          <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
            className={classes.dashButton} onClick={handleUpgrade}>Update Now
          </Button>
        </Modal>
        )
      else
        return(null);
    }
  
   
    return (
    <div className={classes.root} key="uctournament" align="center">
      <BlankArea/>
      <DisplayPageHeader headerName="Upcoming Tournament" groupName="" tournament=""/>
      {/* <BlankArea/> */}
      <ShowTournamentCards/>
      {/* <BlankArea/> */}
      <ShowJumpButtons />
      <BlankArea/>
      <Typography className={classes.withTopSpacing} component="h1" variant="h5">My Groups</Typography>
      <ShowGroupCards/>
      {/* <BlankArea /> */}
      <DisplayUpgrade/>
      <BlankArea />
    </div>
    );
    }
