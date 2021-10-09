import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext";
//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { CricDreamTabs, setTab }from "CustomComponents/CricDreamTabs"
import axios from "axios";
//import SignIn from "views/Login/SignIn.js";
//import SignUp from "views/Login/SignUp.js";
//import Welcome from "views/APL/Welcome";
//import ResetPassword from "views/Login/ResetPassword";
//import JoinGroup from "views/Group/JoinGroup.js"
//import ForgotPassword from "views/Login/ForgotPassword.js";
import IdleTimer from 'react-idle-timer'
import { setIdle }from "views/functions.js"
//import Wallet from "views/Wallet/Wallet";
import { PinDropSharp } from "@material-ui/icons";
import firebase from 'firebase';
//import arunfb from 'firebase';

//const arunfb = require('firebase/app').default
//import messaging from 'firebase/messaging';

import { 
isMobile, cdRefresh, specialSetPos, 
encrypt, 
clearBackupData, downloadApk 
} from "views/functions.js"



const hist = createBrowserHistory();


function checkJoinGroup(pathArray) {
  let sts = false;
  if ((pathArray[1].toLowerCase() === "joingroup") && (pathArray.length === 3) && (pathArray[2].length > 0)) {
    localStorage.setItem("joinGroupCode", pathArray[2]);
    sts = true;
  }
  return sts;
}

function initCdParams() {
  localStorage.setItem("joinGroupCode", "");
  let ipos = 0;
  if ((localStorage.getItem("tabpos") !== null) &&
  (localStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(localStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) localStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    localStorage.setItem("tabpos", 0);
  console.log(`ipos: ${ipos}   Tabpos ${localStorage.getItem("tabpos")}`)
}

function isUserLogged() {
  console.log("User is", localStorage.getItem("uid"));
  if ((localStorage.getItem("uid") === "") || 
      (localStorage.getItem("uid") === "0") ||
      (localStorage.getItem("uid") === null))
    return false;
  else
    return true;
}

function checkResetPasswordRequest() {
	let resetLink = "";
	let x = location.pathname.split("/");
  console.log("Path is");
  console.log(x);
	if (x.length >= 4)
	if (x[1] === "aplmaster")
	if (x[2] === "resetpasswordconfirm") {
		resetLink = x[3];
	}
	return resetLink;
}


function AppRouter() {
  //let history={hist}
	
  const [user, setUser] = useState(null);
	const [fireToken, setFireToken] = useState("");
	
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  // console.log(`000. User is ${localStorage.getItem("uid")}`)
  
  async function handleOnActive (event) {
    // console.log('user is active', event);
  }

  async function handleOnAction (event) {
    // console.log(`Action from user ${sessionStorage.getItem("uid")}`);
  }


  async function handleOnIdle (event) {
    // console.log('user is idle', event);
    // console.log('last active', idleTimer.getLastActiveTime());
    setIdle(true);
  }



  function DispayTabs() {
    //let isLogged = isUserLogged();
    // console.log("Login status", isLogged)
		return (
			<div>
				<CricDreamTabs/>
			</div>
		)   
  }


  initCdParams();

  let mypath = window.location.pathname.split("/");
  if (checkJoinGroup(mypath)) {
    //console.log("join group found");
    localStorage.setItem("tabpos", 105);
    //history.push("/")
  } 



if (process.env.REACT_APP_DEVICE === "WEB") {
	const config ={
		apiKey: "AIzaSyBqJAEVFJOsrztnMrIqO0tfGmisU95Plrk",
		authDomain: "aplclient.firebaseapp.com",
		projectId: "aplclient",
		storageBucket: "aplclient.appspot.com",
		messagingSenderId: "1018469539659",
		appId: "1:1018469539659:web:102ea6f8c5cf39dda9d2ce",
		measurementId: "G-4RN59HCLKD"
	}
	firebase.initializeApp(config);
	
	const messaging = firebase.messaging();
	  // get the FIREBASE token and save it. We will send it to server in Home page
    messaging.requestPermission().then(()=>{
      return messaging.getToken()
    }).then(token=> {
      console.log('Token : ',token);
			localStorage.setItem("token", token);
			console.log("Done");
    }).catch((err)=>{
      console.log(err); 
	  })

		/*
    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      // ...
    }); 

    messaging.onBackgroundMessage(function(payload){
      console.log("onBackgroundMessage:",payload);
    });
		*/
  }


  return (
    <Router history={hist}> 
    <UserContext.Provider value={value}>
    {/* <Route path="/apl/walletdetails" component={Dummy} /> */}
    {/* <Route path="/apl/walletadd" component={Dummy} /> */}
    </UserContext.Provider>
    <DispayTabs />
    </Router>
  );

}

export default AppRouter;
