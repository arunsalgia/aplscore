import React, { useEffect, useState } from 'react';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
// import { UserContext } from "../../UserContext";
// import { Typography } from '@material-ui/core';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
import { NoGroup, DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import {orange, deepOrange}  from '@material-ui/core/colors';
import { Divider } from '@material-ui/core';
import globalStyles from "assets/globalStyles";


const drawerWidth = 100;

/***
const useStyles = makeStyles((theme) => ({
  margin: {
      margin: theme.spacing(1),
  },
  image: {
      height: "200px"
  },
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  medium: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
***/

export default function MyTeam() {
    // const { user } = useContext(UserContext);
    // const theme = useTheme();

  // const classes = useStyles();
  const gClasses = globalStyles();

  const [teamArray, setTeamArray] = useState([]);


  useEffect(() => {
    if (localStorage.getItem("team")) 
    setTeamArray(JSON.parse(localStorage.getItem("team")));

    const fetchTeam = async () => {
      try {
          var myTeamUrl = "";
          if (hasGroup())
          {
              var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteam/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`);
              setTeamArray(response.data);
              localStorage.setItem("team", JSON.stringify(response.data));
          }
      } catch (e) {
          console.log(e)
      }
    }
    fetchTeam();
  }, []);


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
      teamArray.map(team => 
      <div>
        <DisplayPageHeader headerName="My Team" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
        <Table>
        <TableHead p={0}>
            <TableRow key="header" align="center">
            <TableCell className={gClasses.th} p={0} align="center">Player Name</TableCell>
            <TableCell className={gClasses.th} p={0} align="center">Team</TableCell>
            <TableCell className={gClasses.th} p={0} align="center">Bid Amount</TableCell>      
            </TableRow>
        </TableHead>
        <TableBody p={0}>
            {team.players.map(item => {
            return (
                <TableRow key={item.playerName}>
                <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.playerName}
                </TableCell>
                <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.team}
                </TableCell>
                <TableCell className={gClasses.td} p={0} align="center" >
                    {item.bidAmount}
                </TableCell>
                </TableRow>
            )
            })}
        </TableBody> 
        </Table>
        <Divider />
        <ShowJumpButtons />
        <BlankArea />
      </div>
      )
    )
  else
    return (
      <div>
        <NoGroup/>
        <Divider />
        <ShowJumpButtons />
      </div>
    )
};


