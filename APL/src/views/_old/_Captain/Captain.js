import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
//import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
// import Grid from "@materi/Grid";
// import GridItem from "components/Grid/GridItem.js";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
import { UserContext } from "../../UserContext";
import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import { red, blue, green, deepOrange, deepPurple } from '@material-ui/core/colors';
// import { updateLanguageServiceSourceFile } from 'typescript';
import { BlankArea } from 'CustomComponents/CustomComponents';
import globalStyles from "assets/globalStyles";

const vcPrefix = "vicecaptain-"
const cPrefix = "captain-"


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    captain: {
        color: "yellow",
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
    error:  {
        // right: 0,
        fontSize: '12px',
        color: red[700],
        alignItems: 'center',
        marginTop: '0px',
    },
    nonerror:  {
        // right: 0,
        fontSize: '12px',
        color: green[700],
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
    th: { 
        spacing: 0,
        align: "center",
        padding: "none",
        backgroundColor: '#EEEEEE',
        color: deepOrange[700],
        // border: "1px solid black",
        fontWeight: theme.typography.fontWeightBold,
      },
    td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    },
}));




export default function Captain() {
    const classes = useStyles();
    const gClasses = globalStyles();

    window.onbeforeunload = () => setUser("")
    // const { setUser } = useContext(UserContext);
    const [selectedViceCaptain, SetSelectedViceCaptain] = useState("");
    const [selectedCaptain, SetSelectedCaptain] = useState("");
    const [myTeamTableData, setMyTeamTableData] = useState([]);
    const [tournamentStated, setTournamentStarted] = useState(false);
    //const [ errorMessage, setErrorMessage ] = React.useState("");
    //const [backDropOpen, setBackDropOpen] = React.useState(false);
    //const [userMessage, setUserMessage] = React.useState("");
    const [registerStatus, setRegisterStatus] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [firstTime, setFirstTime] = useState(true);
    useEffect(() => {
        if (firstTime) {
            if (localStorage.getItem("captain"))
                SetSelectedCaptain(JSON.parse(localStorage.getItem("captain")));

            if (localStorage.getItem("viceCaptain"))
                SetSelectedViceCaptain(JSON.parse(localStorage.getItem("viceCaptain")));

            if (localStorage.getItem("captainList"))
                setMyTeamTableData(JSON.parse(localStorage.getItem("captainList")));
        }
        const a = async () => {
            if  (!hasGroup()) {
                // handle if not a member of any group
                setFirstTime(false);
                return;
            }

            // console.log("Calling getcaptain")
            // get start of tournamnet (i.e. start of 1st match)
            var mygroup  = localStorage.getItem("gid")
            var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/gamestarted/${localStorage.getItem("gid")}`);
            // console.log("Time:---- ", response.data);
            // console.log(response);
            if (response.data > 0) {
                // console.log("GT0");
                setTournamentStarted(false);
                setTimeLeft(response.data)
                // setTimeLeft(90);
            } else {
                // console.log("LT0");
                setTournamentStarted(true);
            }

            var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/getcaptain/${mygroup}/${localStorage.getItem("uid")}`);
            // console.log(response.data[0]);
            if (response.data.length > 0) {
                SetSelectedCaptain(response.data[0].captainName);
                SetSelectedViceCaptain(response.data[0].viceCaptainName)
                localStorage.setItem("captain", JSON.stringify(response.data[0].captainName));
                localStorage.setItem("viceCaptain", JSON.stringify(response.data[0].viceCaptainName));
            }

            // get list of player purchased by user for aelecting captain / vice captain
            var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteamwos/${mygroup}/${localStorage.getItem("uid")}`;
            const teamResponse = await axios.get(myUrl);
            setMyTeamTableData(teamResponse.data[0].players);
            localStorage.setItem("captainList", JSON.stringify(teamResponse.data[0].players));
            // console.log(teamResponse.data[0].players) ;
        }
        if (firstTime) a();
        setFirstTime(false);
        if (timeLeft)
            setTimeout(() => setTimeLeft(timeLeft-1), 1000);
        else
            setTournamentStarted(true);
    }, [timeLeft])

    // function handleTimer() {}

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
            break;
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }



    function handleSelectedCaptain(newCap) {
        setRegisterStatus(0);
        if (!tournamentStated) {
            if (newCap === selectedViceCaptain)
                SetSelectedViceCaptain("");
            SetSelectedCaptain(newCap);
        }
    };

    function handleSelectedViceCaptain(newViceCap) {
        setRegisterStatus(0);
        if (!tournamentStated) {
            if (newViceCap === selectedCaptain)
                SetSelectedCaptain("");
            SetSelectedViceCaptain(newViceCap);
        }
    };


    async function updateCaptain() {
        // console.log("upd captin vc details");
        var tmp = myTeamTableData.find(x => x.playerName === selectedCaptain);
        let capPid = (tmp) ?  tmp.pid : 0;
        tmp = myTeamTableData.find(x => x.playerName === selectedViceCaptain);
        let vicecapPid = (tmp) ?  tmp.pid : 0;
        var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/captainvicecaptain/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}/${capPid}/${vicecapPid}`;
        // console.log(myUrl);
        const resp = await  axios.get(myUrl);
        // console.log(resp.status)
        setRegisterStatus(resp.status);
       }



    function DisplayCaptainSelectButton() {
        return (
        <div align="center">
        <Button variant="contained" color="primary" size="small"
            disabled={tournamentStated}
            className={classes.button} onClick={updateCaptain}>Update
        </Button>
        </div>
        );
    }

    function OrgShowCaptainViceCaptain() {
        return(
        <Table
            tableKey="t-cvc"
            id="t-cvc"
            size="small"
            tableHeaderColor="warning"
            tableHead={["Player Name", "Captain", "Vice Captain"]}
            tableData={myTeamTableData.map(x => {
                const arr = [
                    x.playerName,
                    <FormControlLabel
                    key={cPrefix+x.playerName}
                    id={cPrefix+x.playerName}
                    className={classes.captain}
                    value={x.playerName}
                    control={<Radio color="primary" key={cPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedCaptain}/>}
                    onClick={() => handleSelectedCaptain(x.playerName)}
                    checked={selectedCaptain === x.playerName}
                    disabled={tournamentStated}
                    />,
                    <FormControlLabel
                    key={vcPrefix+x.playerName}
                    id={vcPrefix+x.playerName}
                    className={classes.captain}
                    value={x.playerName}
                    control={<Radio color="primary" key={vcPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedViceCaptain}/>}
                    onClick={() => handleSelectedViceCaptain(x.playerName)}
                    checked={selectedViceCaptain === x.playerName}
                    disabled={tournamentStated}
                    />
                ]
                return { data: arr, key: "pid", collapse: [] }
            })}
        />
        );
    };

    function ShowCaptainViceCaptain() {
        return(
            <Table>
            <TableHead p={0}>
                <TableRow key="header" align="center">
                <TableCell className={gClasses.th} p={0} align="center">Player Name</TableCell>
                <TableCell className={gClasses.th} p={0} align="center">Captain</TableCell>
                <TableCell className={gClasses.th} p={0} align="center">Vice Captain</TableCell>
                </TableRow>
            </TableHead>
            <TableBody p={0}>
                {myTeamTableData.map(x => {
                return (
                    <TableRow key={x.playerName} align="center">
                    <TableCell  className={gClasses.td} p={0} align="center" >
                        {x.playerName}
                    </TableCell>
                    <TableCell  className={gClasses.td} p={0} align="center" >
                        <FormControlLabel
                            key={cPrefix+x.playerName}
                            id={cPrefix+x.playerName}
                            className={classes.captain}
                            value={x.playerName}
                            control={<Radio color="primary" key={cPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedCaptain}/>}
                            onClick={() => handleSelectedCaptain(x.playerName)}
                            checked={selectedCaptain === x.playerName}
                            disabled={tournamentStated}
                        />
                    </TableCell>
                    <TableCell className={gClasses.td} p={0} align="center" >
                        <FormControlLabel
                            key={vcPrefix+x.playerName}
                            id={vcPrefix+x.playerName}
                            className={classes.captain}
                            value={x.playerName}
                            control={<Radio color="primary" key={vcPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedViceCaptain}/>}
                            onClick={() => handleSelectedViceCaptain(x.playerName)}
                            checked={selectedViceCaptain === x.playerName}
                            disabled={tournamentStated}
                        />
                    </TableCell>
                    </TableRow>
                )
                })}
            </TableBody>
            </Table>
        );
    };

    function DisplayTournamentStarted() {
        if (tournamentStated) {
            return (
                <Typography className={classes.error} align="center">(cannot update after tournament has started.)</Typography>
            );
        } else {
            let x = timeLeft;
            let days = Math.trunc(x / 86400);
            // console.log(days);
            x = x % 86400;
            let h = Math.trunc(x / 3600);
            x = x % 3600;
            let m = Math.trunc( x / 60);
            let s = x % 60;
            let strD = (days > 0) ? `${days}d ` : "";
            let strH = ("0" + h).slice(-2);
            let strM = ("0" + m).slice(-2);
            let strS = ("0" + s).slice(-2);
            return (
                <Typography className={classes.nonerror} align="center">(Update will be disabled after {strD}{strH}:{strM}:{strS})</Typography>
            );
        }
    }

    function ShowJumpButtons() {
        return (
        <div>
            <BlankArea />
            <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
        </div>
        )
    }

    if (hasGroup())
        return (
        <div className={classes.root} key="cpataininfo">
            {/* <h3 align="center">Captain and Vice Captain ({localStorage.getItem("tournament")})</h3> */}
            {/* <h3 className={classes.hdrText} align="center">Captain/ViceCaptain</h3> */}
            {/* <Typography align="center" component="h1" variant="h5">Captain/ViceCaptain</Typography> */}
            {/* <DisplayGroupName groupName={localStorage.getItem("groupName")}/> */}
            <DisplayPageHeader headerName="Captain/ViceCaptain" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
            <DisplayTournamentStarted/>
            <ShowCaptainViceCaptain/>
            <BlankArea/>
            <ShowResisterStatus/>
            <BlankArea/>
            <DisplayCaptainSelectButton/>
            <ShowJumpButtons />
            <BlankArea />
            {/* <MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={userMessage} /> */}
        </div>
        );
    else
        return <NoGroup/>;
}
