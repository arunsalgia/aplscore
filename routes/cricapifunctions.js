const Free_CricAPI_Key="ef8990f6-8506-41e7-8b3a-55726f58759a";
const Paid_CricAPI_Key="b8d671a6-3b23-4d7b-b563-74e83f947741";
const CricAPI_Key=Free_CricAPI_Key;

const CricAPI_BasePrefix="https://api.cricapi.com/v1/";
const CricApl_BaseKey = "?apikey=" + CricAPI_Key
//const CricAPI_Prefix="https://api.cricapi.com/v1/series?apikey=";

const CricAPI_Prefix=CricAPI_BasePrefix + "series" + CricApl_BaseKey;      //"https://api.cricapi.com/v1/series?apikey=";
const CricAPI_PostFix_NewTournament="&offset=0";

//const CricAPI_Prefix_NewMatches="https://api.cricapi.com/v1/series_info?apikey=";

const CricAPI_Prefix_NewMatches = CricAPI_BasePrefix + "series_info" + CricApl_BaseKey;
const CricAPI_PostFix_NewMatches="&id=";

const CricAPI_Prefix_MatchesScore = CricAPI_BasePrefix + "match_scorecard" + CricApl_BaseKey;
const CricAPI_PostFix_MatchesScore="&id=";


const CricAPI_Prefix_Squad = CricAPI_BasePrefix + "series_squad" + CricApl_BaseKey;
const CricAPI_PostFix_Squad="&id=";

const CricAPI_Prefix_FindPlayer = CricAPI_BasePrefix + "players" + CricApl_BaseKey;
const CricAPI_PostFix_FindPlayer="&offset=0&search=";


var testMatchId = "489be47a-7e10-4bf1-9aad-201b67f45bf8";
var debug = false;

MATCHSCORE = {
  "apikey": "ef8990f6-8506-41e7-8b3a-55726f58759a",
  "data": {
    "id": "cacf2d34-41b8-41dd-91ed-5183d880084c",
    "name": "Kolkata Knight Riders vs Royal Challengers Bengaluru, 1st Match",
    "matchType": "t20",
    "status": "Royal Challengers Bengaluru won by 7 wkts",
    "venue": "Eden Gardens, Kolkata",
    "date": "2025-03-22",
    "dateTimeGMT": "2025-03-22T14:00:00",
    "teams": [
      "Kolkata Knight Riders",
      "Royal Challengers Bengaluru"
    ],
    "score": [
      {
        "r": 174,
        "w": 8,
        "o": 20,
        "inning": "Kolkata Knight Riders Inning 1"
      },
      {
        "r": 177,
        "w": 3,
        "o": 16.2,
        "inning": "Royal Challengers Bengaluru Inning 1"
      }
    ],
    "tossWinner": "Royal Challengers Bengaluru",
    "tossChoice": "bowl",
    "matchWinner": "Royal Challengers Bengaluru",
    "series_id": "d5a498c8-7596-4b93-8ab0-e0efc3345312",
    "scorecard": [
      {
        "batting": [
          {
            "batsman": {
              "id": "000f9f7c-cc24-4a85-8638-b013b0f4760e",
              "name": "Quinton de Kock"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "2190c28d-1712-4fd2-ae44-9ac54319fc21",
              "name": "Josh Hazlewood"
            },
            "catcher": {
              "id": "e28de73b-f5df-49eb-bdf6-c50471319404",
              "name": "Jitesh Sharma"
            },
            "dismissal-text": "c jitesh sharma b hazlewood",
            "r": 4,
            "b": 5,
            "4s": 1,
            "6s": 0,
            "sr": 80,
            "": 0
          },
          {
            "batsman": {
              "id": "ef2e9c01-41f2-4349-a945-45d8b11dbd19",
              "name": "Sunil Narine"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "a1f7a1f3-f19c-43d2-bcd7-b4bae22f5842",
              "name": "Rasikh Dar Salam"
            },
            "catcher": {
              "id": "e28de73b-f5df-49eb-bdf6-c50471319404",
              "name": "Jitesh Sharma"
            },
            "dismissal-text": "c jitesh sharma b rasikh salam",
            "r": 44,
            "b": 26,
            "4s": 5,
            "6s": 3,
            "sr": 169.23,
            "": 0
          },
          {
            "batsman": {
              "id": "cdc2646c-1fe7-4bc2-b26e-42453f45a212",
              "name": "Ajinkya Rahane"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159",
              "name": "Krunal Pandya"
            },
            "catcher": {
              "id": "a1f7a1f3-f19c-43d2-bcd7-b4bae22f5842",
              "name": "Rasikh Dar Salam"
            },
            "dismissal-text": "c rasikh salam b krunal pandya",
            "r": 56,
            "b": 31,
            "4s": 6,
            "6s": 4,
            "sr": 180.65,
            "": 0
          },
          {
            "batsman": {
              "id": "c3236037-6694-404a-8f01-9ad880564ea9",
              "name": "Venkatesh Iyer"
            },
            "dismissal": "bowled",
            "bowler": {
              "id": "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159",
              "name": "Krunal Pandya"
            },
            "dismissal-text": "b krunal pandya",
            "r": 6,
            "b": 7,
            "4s": 1,
            "6s": 0,
            "sr": 85.71,
            "": 0
          },
          {
            "batsman": {
              "id": "3c89df94-f39c-4c51-8e64-441c73c32c78",
              "name": "Angkrish Raghuvanshi"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "f061b5fc-cd70-480c-86aa-45c7828e739c",
              "name": "Yash Dayal"
            },
            "catcher": {
              "id": "e28de73b-f5df-49eb-bdf6-c50471319404",
              "name": "Jitesh Sharma"
            },
            "dismissal-text": "c jitesh sharma b yash dayal",
            "r": 30,
            "b": 22,
            "4s": 2,
            "6s": 1,
            "sr": 136.36,
            "": 0
          },
          {
            "batsman": {
              "id": "11864f31-b766-4766-9cbc-5026015ace48",
              "name": "Rinku Singh"
            },
            "dismissal": "bowled",
            "bowler": {
              "id": "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159",
              "name": "Krunal Pandya"
            },
            "dismissal-text": "b krunal pandya",
            "r": 12,
            "b": 10,
            "4s": 1,
            "6s": 0,
            "sr": 120,
            "": 0
          },
          {
            "batsman": {
              "id": "effbb8f2-affa-4d18-93c5-285b243f88d0",
              "name": "Andre Russell"
            },
            "dismissal": "bowled",
            "bowler": {
              "id": "2bf2258f-f35e-4831-884e-f88ef46968f5",
              "name": "Suyash Sharma"
            },
            "dismissal-text": "b suyash sharma",
            "r": 4,
            "b": 3,
            "4s": 1,
            "6s": 0,
            "sr": 133.33,
            "": 0
          },
          {
            "batsman": {
              "id": "3187d301-269d-4823-b895-66d652ddefca",
              "name": "Ramandeep Singh "
            },
            "dismissal-text": "not out",
            "r": 6,
            "b": 9,
            "4s": 0,
            "6s": 0,
            "sr": 66.67,
            "": 0
          },
          {
            "batsman": {
              "id": "225ae9ea-dba6-456d-a64b-2dbd7476c8f0",
              "name": "Harshit Rana"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "2190c28d-1712-4fd2-ae44-9ac54319fc21",
              "name": "Josh Hazlewood"
            },
            "catcher": {
              "id": "e28de73b-f5df-49eb-bdf6-c50471319404",
              "name": "Jitesh Sharma"
            },
            "dismissal-text": "c jitesh sharma b hazlewood",
            "r": 5,
            "b": 6,
            "4s": 1,
            "6s": 0,
            "sr": 83.33,
            "": 0
          },
          {
            "batsman": {
              "id": "0284af4f-d4eb-4894-bacc-a468c1020951",
              "name": "Spencer Johnson"
            },
            "dismissal-text": "not out",
            "r": 1,
            "b": 1,
            "4s": 0,
            "6s": 0,
            "sr": 100,
            "": 0
          }
        ],
        "bowling": [
          {
            "bowler": {
              "id": "2190c28d-1712-4fd2-ae44-9ac54319fc21",
              "name": "Josh Hazlewood"
            },
            "o": 4,
            "m": 0,
            "r": 22,
            "w": 2,
            "nb": 0,
            "wd": 0,
            "eco": 5.5
          },
          {
            "bowler": {
              "id": "f061b5fc-cd70-480c-86aa-45c7828e739c",
              "name": "Yash Dayal"
            },
            "o": 3,
            "m": 0,
            "r": 25,
            "w": 1,
            "nb": 0,
            "wd": 0,
            "eco": 8.3
          },
          {
            "bowler": {
              "id": "a1f7a1f3-f19c-43d2-bcd7-b4bae22f5842",
              "name": "Rasikh Dar Salam"
            },
            "o": 3,
            "m": 0,
            "r": 35,
            "w": 1,
            "nb": 0,
            "wd": 2,
            "eco": 11.7
          },
          {
            "bowler": {
              "id": "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159",
              "name": "Krunal Pandya"
            },
            "o": 4,
            "m": 0,
            "r": 29,
            "w": 3,
            "nb": 0,
            "wd": 1,
            "eco": 7.2
          },
          {
            "bowler": {
              "id": "2bf2258f-f35e-4831-884e-f88ef46968f5",
              "name": "Suyash Sharma"
            },
            "o": 4,
            "m": 0,
            "r": 47,
            "w": 1,
            "nb": 0,
            "wd": 1,
            "eco": 11.8
          },
          {
            "bowler": {
              "id": "d1c0a448-6ee6-473a-90a2-e6a486698a8a",
              "name": "Liam Livingstone"
            },
            "o": 2,
            "m": 0,
            "r": 14,
            "w": 0,
            "nb": 0,
            "wd": 0,
            "eco": 7
          }
        ],
        "catching": [
          {
            "catcher": {
              "id": "e28de73b-f5df-49eb-bdf6-c50471319404",
              "name": "Jitesh Sharma"
            },
            "stumped": 0,
            "runout": 0,
            "catch": 4,
            "cb": 0,
            "lbw": 0,
            "bowled": 0
          },
          {
            "catcher": {
              "id": "a1f7a1f3-f19c-43d2-bcd7-b4bae22f5842",
              "name": "Rasikh Dar Salam"
            },
            "stumped": 0,
            "runout": 0,
            "catch": 1,
            "cb": 0,
            "lbw": 0,
            "bowled": 0
          },
          {
            "stumped": 0,
            "runout": 0,
            "catch": 0,
            "cb": 0,
            "lbw": 0,
            "bowled": 2,
            "catcher": {
              "id": "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159",
              "name": "Krunal Pandya"
            }
          },
          {
            "stumped": 0,
            "runout": 0,
            "catch": 0,
            "cb": 0,
            "lbw": 0,
            "bowled": 1,
            "catcher": {
              "id": "2bf2258f-f35e-4831-884e-f88ef46968f5",
              "name": "Suyash Sharma"
            }
          }
        ],
        "extras": {
          "r": 6,
          "b": 0
        },
        "totals": {},
        "inning": "Kolkata Knight Riders Inning 1"
      },
      {
        "batting": [
          {
            "batsman": {
              "id": "6db25d60-ff96-4d8d-8d22-dedeeb5ffa29",
              "name": "Philip Salt"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "702254aa-2764-4fe4-b28e-20336a0ab069",
              "name": "Varun Chakaravarthy"
            },
            "catcher": {
              "id": "0284af4f-d4eb-4894-bacc-a468c1020951",
              "name": "Spencer Johnson"
            },
            "dismissal-text": "c spencer johnson b varun chakaravarthy",
            "r": 56,
            "b": 31,
            "4s": 9,
            "6s": 2,
            "sr": 180.65,
            "": 0
          },
          {
            "batsman": {
              "id": "c61d247d-7f77-452c-b495-2813a9cd0ac4",
              "name": "Virat Kohli"
            },
            "dismissal-text": "not out",
            "r": 59,
            "b": 36,
            "4s": 4,
            "6s": 3,
            "sr": 163.89,
            "": 0
          },
          {
            "batsman": {
              "id": "74c6584a-45a5-4781-a5e7-c0c9340da954",
              "name": "Devdutt Padikkal"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "ef2e9c01-41f2-4349-a945-45d8b11dbd19",
              "name": "Sunil Narine"
            },
            "catcher": {
              "id": "3187d301-269d-4823-b895-66d652ddefca",
              "name": "Ramandeep Singh "
            },
            "dismissal-text": "c ramandeep singh b narine",
            "r": 10,
            "b": 10,
            "4s": 1,
            "6s": 0,
            "sr": 100,
            "": 0
          },
          {
            "batsman": {
              "id": "88215ee9-ca67-48af-a3f0-6b38718bd830",
              "name": "Rajat Patidar"
            },
            "dismissal": "catch",
            "bowler": {
              "id": "82de5824-b29b-4737-9e9d-44f5796ef227",
              "name": "Vaibhav Arora"
            },
            "catcher": {
              "id": "11864f31-b766-4766-9cbc-5026015ace48",
              "name": "Rinku Singh"
            },
            "dismissal-text": "c rinku singh b vaibhav arora",
            "r": 34,
            "b": 16,
            "4s": 5,
            "6s": 1,
            "sr": 212.5,
            "": 0
          },
          {
            "batsman": {
              "id": "d1c0a448-6ee6-473a-90a2-e6a486698a8a",
              "name": "Liam Livingstone"
            },
            "dismissal-text": "not out",
            "r": 15,
            "b": 5,
            "4s": 2,
            "6s": 1,
            "sr": 300,
            "": 0
          }
        ],
        "bowling": [
          {
            "bowler": {
              "id": "82de5824-b29b-4737-9e9d-44f5796ef227",
              "name": "Vaibhav Arora"
            },
            "o": 3,
            "m": 0,
            "r": 42,
            "w": 1,
            "nb": 0,
            "wd": 1,
            "eco": 14
          },
          {
            "bowler": {
              "id": "0284af4f-d4eb-4894-bacc-a468c1020951",
              "name": "Spencer Johnson"
            },
            "o": 2.2,
            "m": 0,
            "r": 31,
            "w": 0,
            "nb": 0,
            "wd": 0,
            "eco": 13.3
          },
          {
            "bowler": {
              "id": "702254aa-2764-4fe4-b28e-20336a0ab069",
              "name": "Varun Chakaravarthy"
            },
            "o": 4,
            "m": 0,
            "r": 43,
            "w": 1,
            "nb": 0,
            "wd": 0,
            "eco": 10.8
          },
          {
            "bowler": {
              "id": "225ae9ea-dba6-456d-a64b-2dbd7476c8f0",
              "name": "Harshit Rana"
            },
            "o": 3,
            "m": 0,
            "r": 32,
            "w": 0,
            "nb": 0,
            "wd": 0,
            "eco": 10.7
          },
          {
            "bowler": {
              "id": "ef2e9c01-41f2-4349-a945-45d8b11dbd19",
              "name": "Sunil Narine"
            },
            "o": 4,
            "m": 0,
            "r": 27,
            "w": 1,
            "nb": 0,
            "wd": 0,
            "eco": 6.8
          }
        ],
        "catching": [
          {
            "catcher": {
              "id": "0284af4f-d4eb-4894-bacc-a468c1020951",
              "name": "Spencer Johnson"
            },
            "stumped": 0,
            "runout": 0,
            "catch": 1,
            "cb": 0,
            "lbw": 0,
            "bowled": 0
          },
          {
            "catcher": {
              "id": "3187d301-269d-4823-b895-66d652ddefca",
              "name": "Ramandeep Singh "
            },
            "stumped": 0,
            "runout": 0,
            "catch": 1,
            "cb": 0,
            "lbw": 0,
            "bowled": 0
          },
          {
            "catcher": {
              "id": "11864f31-b766-4766-9cbc-5026015ace48",
              "name": "Rinku Singh"
            },
            "stumped": 0,
            "runout": 0,
            "catch": 1,
            "cb": 0,
            "lbw": 0,
            "bowled": 0
          }
        ],
        "extras": {
          "r": 3,
          "b": 0
        },
        "totals": {},
        "inning": "Royal Challengers Bengaluru Inning 1"
      }
    ],
    "matchStarted": true,
    "matchEnded": true
  },
  "status": "success",
  "info": {
    "hitsToday": 30,
    "hitsUsed": 10,
    "hitsLimit": 100,
    "credits": 0,
    "server": 5,
    "queryTime": 22.5503,
    "s": 0,
    "cache": 0
  }
};


// https://api.cricapi.com/v1/series?apikey=ef8990f6-8506-41e7-8b3a-55726f58759a&offset=0


async function cricapi_get_new_tournaments() {
  var myDataArray = [];
  await fetch(CricAPI_Prefix + CricAPI_PostFix_NewTournament)
    .then(data => data.json())
    .then(data => {
        //console.log("Enteretd");
        if (data.status === "success") {
          //console.log(data);
          if (data.data) {
            myDataArray = data.data;
            //console.log("Got the data");
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new tournaments");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}


async function cricapi_get_new_matches(tournamentSeriesId) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_NewMatches + CricAPI_PostFix_NewMatches + tournamentSeriesId;
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          if (data.data) {
            myDataArray = data.data.matchList;
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}

// https://api.cricapi.com/v1/match_info?apikey=ef8990f6-8506-41e7-8b3a-55726f58759a&id=28004108-5cdd-43f7-82f3-f530bf8b2ce9

async function cricapi_get_score(matchId) {
  var myDataArray = [];
	if (debug) matchId = testMatchId;
  let myURL = CricAPI_Prefix_MatchesScore + CricAPI_PostFix_NewMatches + matchId;
  console.log(myURL);
	//console.log(MATCHSCORE.data);
	//console.log("-------Sending data ti cller");
	//return MATCHSCORE.data;
	
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          console.log("success");
          if (data.data) {
            myDataArray = data.data;
						//console.log(myDataArray);
						//console.log(myDataArray);
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching matches score ");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}


async function cricapi_get_tournament_squad(tournamentSeriesId) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_Squad + CricAPI_PostFix_Squad + tournamentSeriesId;
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          console.log("success");
          //console.log(data);
          if (data.data) {
            myDataArray = data.data;
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}

async function cricapi_find_palyers(searchStr) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_FindPlayer + CricAPI_PostFix_FindPlayer + searchStr.toLowerCase();
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          console.log("success");
          if (data.data) {
            myDataArray = data.data;
						console.log(myDataArray);
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}
module.exports = {
  cricapi_get_new_tournaments,
  cricapi_get_new_matches,
  cricapi_get_score,
  cricapi_get_tournament_squad,
  cricapi_find_palyers,
}; 


