import React, { useState, useEffect } from 'react';
// import './App.css';
// import axios from "axios";
// import Grid from '@material-ui/core/Grid';
// import download from 'js-file-download';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import globalStyles from "assets/globalStyles";
// import modalStyles from "assets/modalStyles";
// import { template } from 'lodash';
// import { downloadApk } from "views/functions";
// import { BlankArea } from "customComponents/CustomComponents";

// import desktopImage from './DESKTOP.JPG';
// import mobileImage from './MOBILE.JPG';
// import Mojo1 from './Mojo1';
// import Image from './Image';

import { isMobile, cdRefresh } from "views/functions.js"
// const APPNAME  = process.env.REACT_APP_NAME;
// const APLAXIOS = process.env.REACT_APP_APLAXIOS;
const BRHEIGHT = 8;

const useStyles = makeStyles((theme) => ({
	background: {
		backgroundImage:  `${process.env.PUBLIC_URL}/image/APLWELCOME.JPG`,
	},
	container: {
		backgroundImage: `${process.env.PUBLIC_URL}/image/APLWELCOME.JPG`,   //`url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		width: '100vw',
		height: '100vh'
	},
	buttonLeft: {
		position: "fixed",
		top: "10%",
		left: "5%"
	},
	buttonRight: {
		position: "fixed",
		top: "10%",
		right: "5%"
	}
}));

const Welcome = () => {
	  let classes = useStyles();
    // let gClasses = globalStyles();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [bgImage, setBgImage] = useState("APLWELCOME")

    // const imageUrl =  ? desktopImage : mobileImage;
    // const [breakCount, setBreakCount] = useState(0);
    // const [dummyArray, setDummyArray] = useState([]);
    // const [ downloadMessage, setDownloadMessage ] = useState("");

    function calculateBR() {
        // console.log(window.innerHeight, BRHEIGHT);
        // let myCount = Math.floor(window.innerHeight / BRHEIGHT) - 10;
        // if (myCount < 1) myCount = 1;
        // if (myCount > (200-1)) myCount = (200-1);
        // setBreakCount(myCount);
        // console.log(breakCount);
        // let tmp = (window.innerWidth >= 650) ? "WELCOME" : "MOBILE";
        // console.log("Imgae is", tmp);
        // setBgImage(tmp);
    }
    useEffect(() => {
        // let tmp=[];
        // for(let i=0; i<200; ++i) {
        //     tmp.push(i);
        // }
        // setDummyArray(tmp);
        calculateBR();

        const handleWindowResize = () => {
            console.log(window.innerHeight, window.innerWidth);
            calculateBR();
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
						// console.log()
        };

        setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleWindowResize);

        return () => {
           window.removeEventListener('resize', handleWindowResize);
        }
    }, []);
    
    
		function handleSignin() {
			sessionStorage.setItem("currentLogin", "SIGNIN");
			cdRefresh();
		}
   
		function handleSignup() {
			sessionStorage.setItem("currentLogin", "SIGNUP");
			cdRefresh();
		}


    let myIMage= `${process.env.PUBLIC_URL}/image/${bgImage}.JPG`;
    console.log(myIMage);
    // console.log(breakCount);
    // console.log(dummyArray.length);
    return (
				<div>
					{/* <img src={myIMage} alt="ARUN" height={setWindowHeight} width={windowWidth}/> */}
					<img src={myIMage} alt="ARUN" height={windowHeight} width={windowWidth} />
					<Button type="submit" variant="contained" color="primary" 
						onClick={handleSignin}
						className={classes.buttonLeft}
					>
					SignIn
					</Button>
					<Button type="submit" variant="contained" color="primary" 
						onClick={handleSignup}
						className={classes.buttonRight}
					>
					SignUp
					</Button>
					</div>
    );
};

export default Welcome;
