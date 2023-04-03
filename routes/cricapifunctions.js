const CricAPI_Key="ef8990f6-8506-41e7-8b3a-55726f58759a";

const CricAPI_Prefix="https://api.cricapi.com/v1/series?apikey=";
const CricAPI_PostFix_NewTournament="&offset=0";

const CricAPI_Prefix_NewMatches="https://api.cricapi.com/v1/series_info?apikey=";
const CricAPI_PostFix_NewMatches="&id=";

// https://api.cricapi.com/v1/series?apikey=ef8990f6-8506-41e7-8b3a-55726f58759a&offset=0


async function cricapi_get_new_tournaments() {
  var myDataArray = [];
  await fetch(CricAPI_Prefix + CricAPI_Key + CricAPI_PostFix_NewTournament)
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
  let myURL = CricAPI_Prefix_NewMatches + CricAPI_Key + CricAPI_PostFix_NewMatches + tournamentSeriesId;
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

module.exports = {
  cricapi_get_new_tournaments,
  cricapi_get_new_matches,
}; 
