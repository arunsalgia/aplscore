import React, { useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
//import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, DisplayBalance } from 'CustomComponents/CustomComponents';
import { getMinimumBalance } from 'views/functions';
// import classes from '*.module.css';
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
// import { red, deepOrange } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');


//const INSTAMOJOSCRIPT="https://js.instamojo.com/v1/checkout.js";
const COUNTPERPAGE=5;


const useStyles = makeStyles((theme) => ({
  wallet : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#B3E5FC',
  },
  bonus : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#FFC0CB',
  },
}));
  

export default function Wallet(props) {
  //useScript(INSTAMOJOSCRIPT);

  //const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();

  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINBALANCE));
  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  const [transactions, setTransactions] = useState([]);
  const [masterTransactions, setMasterTransactions] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  // const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [minMessage, setMinMessage] = useState(`Minimum balance of  ${process.env.REACT_APP_MINBALANCE} is required for withdrawal.`)
  
  // have we come via route
  //console.log("Wallet", localStorage.getItem("menuValue"));
  // console.log("details from Insta",
  // sessionStorage.getItem("payment_id"),
  // sessionStorage.getItem("payment_status"),
  // sessionStorage.getItem("payment_request_id")
  // );
  useEffect(() => {
	  
	if (localStorage.getItem("saveBalance"))
      setBalance(JSON.parse(localStorage.getItem("saveBalance")));

	if (localStorage.getItem("saveTransactions")) {
      setTransactions(JSON.parse(localStorage.getItem("saveTransactions")));
	  setMasterTransactions(JSON.parse(localStorage.getItem("saveTransactions")));
	}
	
    const minimumAmount = async () => {
      let amt = await getMinimumBalance();
      setMinBalance(amt); 
      console.log("Min Balance ", amt);
      setMinMessage(`Minimum balance of  ${amt} is required for withdrawal.`);
    }
    
	const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        setTransactions(response.data);
        setMasterTransactions(response.data);
		localStorage.setItem("saveTransactions", JSON.stringify(response.data));
		
        // let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        // setEmptyRows(myempty);

        response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${localStorage.getItem("uid")}`);
        setBalance(response.data);
		localStorage.setItem("saveBalance", JSON.stringify(response.data));
      } catch (e) {
          console.log(e)
      }
    }
    WalletInfo();
    minimumAmount()
  }, []);

  function ShowResisterStatus() {
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = message;
        errmsg = false;
      break;
      case 1002:
        myMsg = message;
      break;
      case 0:
        myMsg = ``;
        errmsg = false;
      break;      
      default:
        myMsg = `Unknown error code ${registerStatus}`;
        break;
    }
    let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }


  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    // let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    // setEmptyRows(myempty);

  };


  function handleAddWallet() {
    setTab(process.env.REACT_APP_ADDWALLET);
  }

  function handleWithdraw() {
    if (balance.wallet <= minBalance)
      alert(minMessage);
    else
      setTab(process.env.REACT_APP_WITHDRAWWALLET);
  }


  function WalletButton() {
    return (
      <div>
      <Button type="submit" variant="contained" color="primary"
        onClick={handleAddWallet}
        className={gClasses.button}>Add to Wallet
      </Button>
      <Button type="submit" variant="contained" color="primary" 
       onClick={handleWithdraw}
        className={gClasses.button}>Withdraw
     </Button>
     </div>
    )
  }

  function allData() {
    // console.log(" All");
    setTransactions(masterTransactions);
    setPage(0);
  }

  function walletData() {
    let tmp = masterTransactions.filter(x => x.isWallet === true);
    // console.log(" Wallet", tmp.length);
    setTransactions(tmp);
    setPage(0);
  }

  function bonusData() {
    let tmp = masterTransactions.filter(x => x.isWallet === false);
    // console.log(" Bonus", tmp.length);
    setTransactions(tmp);
    setPage(0);
  }

  function SelectButton() {
  return(
    <Grid key="walletType" align="center" container>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_t20" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={allData}>
    All
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_odi" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={walletData}>
    Wallet
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_test" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={bonusData}>
    Bonus
    </Button>
    </Grid>
    </Grid>      
  )};
  



  return (
    <Container component="main" maxWidth="xs">
      <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div className={gClasses.paper}>
        {/* <Typography component="h1" variant="h5">Wallet Balance: {balance.wallet}</Typography>
        <Typography component="h1" variant="h5">Bonus Balance : {balance.bonus}</Typography> */}
        <ShowResisterStatus />
        <BlankArea />
        <SelectButton/>
        <TableContainer>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={gClasses.th} p={0} align="center">Date</TableCell>      
            <TableCell className={gClasses.th} p={0} align="center">Type</TableCell>
            <TableCell className={gClasses.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody>
            {transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage )
            .map( (item, index) => {
              let myClass = (item.isWallet) ? classes.wallet : classes.bonus;
              // console.log(item.isWallet);
              return (
                <TableRow key={index}>
                  <TableCell  className={myClass} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={myClass} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={myClass} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[COUNTPERPAGE]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <BlankArea />
        <WalletButton />
      </div>
    </Container>
  );
}
