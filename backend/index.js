const cheerio = require('cheerio')
const axios = require('axios')
const express = require("express");
const app = express();
var cors = require('cors')
//const fetchCricketInfo = require("./index_2")

app.use(cors())
app.use(express.json());


app.get('/', async(req, res) => {
  try {
        const response = await axios.get("https://www.espncricinfo.com/")
        const $ = cheerio.load(response.data);
        const scorecard_div = $(".ds-no-tap-higlight")  
        let match_details=[];
        //let team1_scorecard=[];
        for(let j=0;j<scorecard_div.length;j++){
          let scorecard = $(scorecard_div[j]).attr('href') 
          let scorecard_encoded = encodeURIComponent(scorecard)
      if(scorecard.includes("live-cricket-score")){
          scorecard = scorecard.replace("live-cricket-score","full-scorecard")
      }
          let world_cup_matches_text = $(scorecard_div[j]).text()
      let world_cup_matches_html = $(scorecard_div[j]).html()
      const $1 = cheerio.load(world_cup_matches_html)
  

     // if(!world_cup_matches_text.includes("WBBL")){
          
          let match_info = $1(".ds-text-tight-xs.ds-text-typo-mid2").text()  
          let team1 = $1(`.ci-team-score:eq(0) p`).text()   
          //let team1_flag = $1(`.ci-team-score:eq(0) img`).attr('src')
          let team1_score = $1(".ci-team-score:eq(0) strong").text()  
          let team2 = $1(`.ci-team-score:eq(1) p`).text()   
          let team2_score = $1(".ci-team-score:eq(1) strong").text() 
          let result = $1(".ds-text-tight-xs.ds-truncate").text()
          
          if(result && result !== "Match yet to begin" && !result.includes("Match starts") && match_info && team1 && team1_score){
            let match={
              id:j,
              match_info,
              team1,
              team1_score,
              team2,
              team2_score,
              result,
              team1_scorecard:[],
              team1_extras:null,
              team1_total_score:null,
              team1_remaining_batters:null,
              team1_fall_of_wicket:null,
              team2_bowling:[],
              team2_scorecard:[],
              team2_extras:null,
              team2_total_score:null,
              team2_remaining_batters:null,
              team2_fall_of_wicket:null,
              team1_bowling:[],
            }
            match_details.push(match)
            
            console.log(result)
            

             //team 1 batting scorecard


      const secondResponse = await axios.get(`https://www.espncricinfo.com/${scorecard}`)
      const $2 = cheerio.load(secondResponse.data);
      let team1_full_name = $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(0)").text()
      let team2_full_name =  $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(1)").text()
      console.log(team1_full_name)
      console.log("----------------")
      console.log("Batsman    R   B   4s  6s  Sr")
      console.log("----------------")
      let table = $2(".ci-scorecard-table:eq(0)")
      const rows = table.find('tbody tr');



rows.each((index, row) => {
const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
const runs = $2(row).find('strong')
const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')
const extras = $2(row).find(".ds-text-tight-s td:eq(2) strong")
const extras_types = $2(row).find(".ds-text-tight-s td:eq(1)")
const batsman_did_not_bat = $2(row).find(".!ds-border-b-0 span span")
const fall_of_wickets_title = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 strong:eq(0)")
const fall_of_wickets = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 span")


let batsman_status = $2(row).find(".ds-flex.ds-cursor-pointer.ds-items-center")
if(batsman_status.html()==null && batsman!=""){
batsman_status = $2(row).find("td:eq(1)")
//console.log(batsman_status.html())
}


if(batsman.text()){
console.log(batsman.text() +"   "+batsman_status.text()+"        "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
//console.log(batsman_status.texm
match.team1_scorecard.push({batsman: batsman.text(),batsman_status:batsman_status.text(),batsman_runs:runs.text(),batsman_ball_faced:balls.text(),batsman_fours:fours.text(),batsman_sixes:sixes.text(),batsman_strike_rate:strikeRate.text()})
}

if(extras!=""){
console.log("--------------")
console.log("Extra: "+extras.text()+" "+extras_types.text())
match.team1_extras = extras.text()+" "+extras_types.text()
console.log("--------------")
}

if(batsman_did_not_bat!=""){
console.log("--------------")
console.log("Did not bat: "+batsman_did_not_bat.text())
match.team1_remaining_batters =batsman_did_not_bat.text()
console.log("--------------")

}

if(fall_of_wickets!=""){
console.log(fall_of_wickets_title.text()+": "+fall_of_wickets.text())
match.team1_fall_of_wicket = fall_of_wickets.text()
}

});

const team1_runrate = $2(".ds-font-bold.ds-bg-fill-content-alternate.ds-text-tight-m:eq(1)")
 
console.log("TOTAL: "+team1_score+"    "+team1_runrate.text())
match.team1_total_score = team1_score+"    "+team1_runrate.text()
//bowling team 2
let bowlingTable = $2("tbody:eq(1) tr")


for (let d=0;d<bowlingTable.length;d++){
  
  let bowlerName = $2(bowlingTable[d]).find("td:eq(0) a span")
  let bowlerOvers = $2(bowlingTable[d]).find("td:eq(1)")
  let bowlerMadien = $2(bowlingTable[d]).find("td:eq(2)")
  let bowlerRuns = $2(bowlingTable[d]).find("td:eq(3)")
  let bowlerWicket = $2(bowlingTable[d]).find("td:eq(4)")
  let bowlerEconomy = $2(bowlingTable[d]).find("td:eq(5)")
  let bowlerWide = $2(bowlingTable[d]).find("td:eq(9)")
  let bowlerNoBall = $2(bowlingTable[d]).find("td:eq(10)")
  if(bowlerName.text()!="See all photos" && bowlerName.text()!=""){
    console.log(bowlerName.text()+"       "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())

    /*match.team2_bowling.push({bowler:bowlerName.text(),bowler_overs:bowlerOvers.text(),bowler_maiden:bowlerMadien.text(),bowler_runs_given:bowlerRuns.text(),bowler_wicket:bowlerWicket.text(),bowler_economy:bowler_economy.text(),bowler_wide:bowlerWide.text(),bowler_noball:bowlerNoBall.text()})*/
    match.team2_bowling.push({bowler_name:bowlerName.text(),bowler_overs:bowlerOvers.text(),bowler_maiden:bowlerMadien.text(),bowler_runs:bowlerRuns.text(),bowler_wicket:bowlerWicket.text(),bowler_economy:bowlerEconomy.text(),bowler_wide:bowlerWide.text(),bowler_noball:bowlerNoBall.text()})
    
  }
}


//team2 batting scorecard

let table_2 = $2(".ci-scorecard-table:eq(1)")
  const rows_2 = table_2.find('tbody tr');

 

  rows_2.each((index, row) => {
      const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
      const runs = $2(row).find('strong')
      const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
      const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
      const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
      const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')
      const extras = $2(row).find(".ds-text-tight-s td:eq(2) strong")
      const extras_types = $2(row).find(".ds-text-tight-s td:eq(1)")
      const batsman_did_not_bat = $2(row).find(".!ds-border-b-0 td div a span span")
      const fall_of_wickets_title = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 strong")
      const fall_of_wickets = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 span")
      let batsman_status = $2(row).find(".ds-flex.ds-cursor-pointer.ds-items-center")
      if(batsman_status.html()==null && batsman.text()!=""){
          batsman_status = $2(row).find("td:eq(1)")
          //console.log(batsman_status.html())
       }

      if(batsman.text()!=""){
        console.log(batsman.text() +"        "+batsman_status.text()+"   "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
        
        match.team2_scorecard.push({batsman: batsman.text(),batsman_status:batsman_status.text(),batsman_runs:runs.text(),batsman_ball_faced:balls.text(),batsman_fours:fours.text(),batsman_sixes:sixes.text(),batsman_strike_rate:strikeRate.text()})
      }

      if(extras!=""){
          console.log("--------------")
          console.log("Extra: "+extras.text()+" "+extras_types.text())
          match.team2_extras = extras.text()+" "+extras_types.text()
          console.log("--------------")
      }

      if(batsman_did_not_bat!=""){
          console.log("Did not bat: "+batsman_did_not_bat.text())
          console.log("--------------")
          match.team2_remaining_batters = batsman_did_not_bat.text()
      }

      if(fall_of_wickets!=""){
          console.log(fall_of_wickets_title.text()+" "+fall_of_wickets.text())
          match.team2_fall_of_wicket = fall_of_wickets.text()
          console.log("--------------------")
      }

    });

    const team2_runrate = $2(".ds-font-bold.ds-bg-fill-content-alternate.ds-text-tight-m:eq(5)")
 
    console.log("TOTAL: "+team2_score+"    "+team2_runrate.text())
    match.team2_total_score = team2_score+"    "+team2_runrate.text()
    //team1 bowling

    let bowlingTable_2 = $2("tbody:eq(3) tr")
    for (let d=0;d<bowlingTable_2.length;d++){
         
      let bowlerName = $2(bowlingTable_2[d]).find("td:eq(0) a span")
      let bowlerOvers = $2(bowlingTable_2[d]).find("td:eq(1)")
      let bowlerMadien = $2(bowlingTable_2[d]).find("td:eq(2)")
      let bowlerRuns = $2(bowlingTable_2[d]).find("td:eq(3)")
      let bowlerWicket = $2(bowlingTable_2[d]).find("td:eq(4)")
      let bowlerEconomy = $2(bowlingTable_2[d]).find("td:eq(5)")
      let bowlerWide = $2(bowlingTable_2[d]).find("td:eq(9)")
      let bowlerNoBall = $2(bowlingTable_2[d]).find("td:eq(10)")
      if(bowlerName.text()!="See all photos" && bowlerName.text()!=""){
        console.log(bowlerName.text()+"       "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())

        match.team1_bowling.push({bowler_name:bowlerName.text(),bowler_overs:bowlerOvers.text(),bowler_maiden:bowlerMadien.text(),bowler_runs:bowlerRuns.text(),bowler_wicket:bowlerWicket.text(),bowler_economy:bowlerEconomy.text(),bowler_wide:bowlerWide.text(),bowler_noball:bowlerNoBall.text()})
    
      }
    }
 

         // console.log("--------------------")
          }
    //    }
      }

      res.json(match_details)

     


  

      } catch (error) {
         res.status(500).json({ error: 'An error occurred' });
        }
});

app.get(`/matches/:id`,async(req,res)=>{
  try {
    const matches = await axios.get("http://localhost:5050")
   
   // const match = matches.data.findById("%2Fseries%2Ficc-cricket-world-cup-2023-24-1367856%2Fnew-zealand-vs-pakistan-35th-match-1384426%2Ffull-scorecard")
   const match = matches.data.find(matc => matc.id === parseInt(req.params.id));
   //const split_id = req.params.id.split("/")
   if (!match) {
    return res.status(404).send('Match not found');
  }

  return res.json(match);   

  } catch (error) {
    res.status(500).json(error);

  }

})


/*async function fetchCricketInfo(){
    try {

    const response = await axios.get("https://www.espncricinfo.com/")
    const $ = cheerio.load(response.data);
    const scorecard_div = $(".ds-no-tap-higlight")
    //console.log(scorecard_div.length)
    //let scorecard = $(scorecard_div).attr('href') 

    

    for(let j=0;j<scorecard_div.length;j++){
        let scorecard = $(scorecard_div[j]).attr('href') 
        if(scorecard.includes("live-cricket-score")){
            scorecard = scorecard.replace("live-cricket-score","full-scorecard")
        }
        let world_cup_matches_text = $(scorecard_div[j]).text()
        let world_cup_matches_html = $(scorecard_div[j]).html()
        const $1 = cheerio.load(world_cup_matches_html)
    

        if(world_cup_matches_text.includes("World Cup 2023")){

            let match_info = $1(".ds-text-tight-xs.ds-text-typo-mid2").text()  
            let team1 = $1(`.ci-team-score:eq(0) p`).text()   
            let team1_score = $1(".ci-team-score:eq(0) strong").text()  
            let team2 = $1(`.ci-team-score:eq(1) p`).text()   
            let team2_score = $1(".ci-team-score:eq(1) strong").text() 
            let result = $1(".ds-text-tight-xs.ds-truncate").text()
            console.log(result)
            if(result){
    
            console.log(match_info+" "+"\n "+team1+": "+ team1_score+"\n "+team2+": "+ team2_score+"\n "+result)
            console.log("--------------------")
            }
    
            console.log(`Full ScoreCard (${scorecard})`)
            console.log("---------------------")

            const secondResponse = await axios.get(`https://www.espncricinfo.com/${scorecard}`)
                    const $2 = cheerio.load(secondResponse.data);
                    let team1_full_name = $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(0)").text()
                    let team2_full_name =  $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(1)").text()
                    console.log(team1_full_name)
                    console.log("----------------")
                    console.log("Batsman    R   B   4s  6s  Sr")
                    console.log("----------------")
                    let table = $2(".ci-scorecard-table:eq(0)")
                    const rows = table.find('tbody tr');

   

    rows.each((index, row) => {
        const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
        const runs = $2(row).find('strong')
        const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
        const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
        const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
        const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')
        const extras = $2(row).find(".ds-text-tight-s td:eq(2) strong")
        const extras_types = $2(row).find(".ds-text-tight-s td:eq(1)")
        const batsman_did_not_bat = $2(row).find(".!ds-border-b-0 span span")
        const fall_of_wickets_title = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 strong:eq(0)")
        const fall_of_wickets = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 span")
         

        let batsman_status = $2(row).find(".ds-flex.ds-cursor-pointer.ds-items-center")
        if(batsman_status.html()==null && batsman.text()!=""){
           batsman_status = $2(row).find("td:eq(1)")
           //console.log(batsman_status.html())
        }
     

        if(batsman.text()){
          console.log(batsman.text() +"   "+batsman_status.text()+"        "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
          //console.log(batsman_status.text())
        }

        if(extras!=""){
            console.log("--------------")
            console.log("Extra: "+extras.text()+" "+extras_types.text())
            console.log("--------------")
        }

        if(batsman_did_not_bat!=""){
            console.log("--------------")
            console.log("Did not bat: "+batsman_did_not_bat.text())
            console.log("--------------")
        }

        if(fall_of_wickets!=""){
         console.log(fall_of_wickets_title.text()+": "+fall_of_wickets.text())
        }

      });

      const team1_runrate = $2(".ds-font-bold.ds-bg-fill-content-alternate.ds-text-tight-m:eq(1)")
   
      console.log("TOTAL: "+team1_score+"    "+team1_runrate.text())

      console.log("-----------")
      console.log("Bowling   O   M   R   W   Eco   Wd   Nb")
      console.log("-----------")
     let bowlingTable = $2("tbody:eq(1) tr")

 
      for (let d=0;d<bowlingTable.length;d++){
        
        let bowlerName = $2(bowlingTable[d]).find("td:eq(0) a span")
        let bowlerOvers = $2(bowlingTable[d]).find("td:eq(1)")
        let bowlerMadien = $2(bowlingTable[d]).find("td:eq(2)")
        let bowlerRuns = $2(bowlingTable[d]).find("td:eq(3)")
        let bowlerWicket = $2(bowlingTable[d]).find("td:eq(4)")
        let bowlerEconomy = $2(bowlingTable[d]).find("td:eq(5)")
        let bowlerWide = $2(bowlingTable[d]).find("td:eq(9)")
        let bowlerNoBall = $2(bowlingTable[d]).find("td:eq(10)")
        if(bowlerName.text()!="See all photos" && bowlerName.text()!=""){
          console.log(bowlerName.text()+"       "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())
          
        }
      }


      console.log("----------------")
      console.log(team2_full_name)
      console.log("----------------")
      console.log("Batsman    R   B   4s  6s  Sr")
      console.log("----------------")


      let table_2 = $2(".ci-scorecard-table:eq(1)")
    const rows_2 = table_2.find('tbody tr');

   

    rows_2.each((index, row) => {
        const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
        const runs = $2(row).find('strong')
        const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
        const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
        const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
        const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')
        const extras = $2(row).find(".ds-text-tight-s td:eq(2) strong")
        const extras_types = $2(row).find(".ds-text-tight-s td:eq(1)")
        const batsman_did_not_bat = $2(row).find(".!ds-border-b-0 td div a span span")
        const fall_of_wickets_title = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 strong")
        const fall_of_wickets = $2(row).find(".ds-text-tight-s.ds-font-regular.ds-leading-4 span")
        let batsman_status = $2(row).find(".ds-flex.ds-cursor-pointer.ds-items-center")
        if(batsman_status.html()==null && batsman.text()!=""){
            batsman_status = $2(row).find("td:eq(1)")
            //console.log(batsman_status.html())
         }

        if(batsman.text()!=""){
          console.log(batsman.text() +"        "+batsman_status.text()+"   "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
          
        }

        if(extras!=""){
            console.log("--------------")
            console.log("Extra: "+extras.text()+" "+extras_types.text())
            console.log("--------------")
        }

        //if(batsman_did_not_bat!=""){
         //   console.log("Did not bat: "+batsman_did_not_bat.text())
        //    console.log("--------------")
       // }

        if(fall_of_wickets!=""){
            console.log(fall_of_wickets_title.text()+" "+fall_of_wickets.text())
            console.log("--------------------")
        }

      });
   
      const team2_runrate = $2(".ds-font-bold.ds-bg-fill-content-alternate.ds-text-tight-m:eq(5)")
   
      console.log("TOTAL: "+team2_score+"    "+team2_runrate.text())


      console.log("-----------")
      console.log("Bowling   O   M   R   W   Eco   Wd   Nb")
      console.log("-----------")
     let bowlingTable_2 = $2("tbody:eq(3) tr")
      for (let d=0;d<bowlingTable_2.length;d++){
           
        let bowlerName = $2(bowlingTable_2[d]).find("td:eq(0) a span")
        let bowlerOvers = $2(bowlingTable_2[d]).find("td:eq(1)")
        let bowlerMadien = $2(bowlingTable_2[d]).find("td:eq(2)")
        let bowlerRuns = $2(bowlingTable_2[d]).find("td:eq(3)")
        let bowlerWicket = $2(bowlingTable_2[d]).find("td:eq(4)")
        let bowlerEconomy = $2(bowlingTable_2[d]).find("td:eq(5)")
        let bowlerWide = $2(bowlingTable_2[d]).find("td:eq(9)")
        let bowlerNoBall = $2(bowlingTable_2[d]).find("td:eq(10)")
        if(bowlerName.text()!="See all photos" && bowlerName.text()!=""){
          console.log(bowlerName.text()+"       "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())
        }
      }
      console.log("------------")
              //  })
            
           break
        }
        

            
            

        
        
    }


    
 // })

    } catch (error) {
        console.error("An error occurred:", error);

    }
}



fetchCricketInfo()*/
  




  /*
  
              axios
                .get(`https://www.espncricinfo.com/${scorecard}`)
                .then((secondResponse)=>{
                    const $2 = cheerio.load(secondResponse.data);
                    let team1_full_name = $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(0)").text()
                    let team2_full_name =  $2(".ds-text-title-xs.ds-font-bold.ds-capitalize:eq(1)").text()
                    console.log(team1_full_name)
                    console.log("----------------")
                    console.log("Batsman    R   B   4s  6s  Sr")
                    console.log("----------------")
                    let table = $2(".ci-scorecard-table:eq(0)")
                    const rows = table.find('tbody tr');

   

    rows.each((index, row) => {
        const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
        const runs = $2(row).find('strong')
        const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
        const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
        const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
        const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')


        if(batsman.text()!=""){
          console.log(batsman.text() +"   "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
        }

      });
      console.log("-----------")
      console.log("Bowling   O   M   R   W   Eco   Wd   Nb")
      console.log("-----------")
     let bowlingTable = $2("tbody:eq(1) tr")

 
      for (let d=0;d<bowlingTable.length;d++){
        
        let bowlerName = $2(bowlingTable[d]).find("td:eq(0) a span")
        let bowlerOvers = $2(bowlingTable[d]).find("td:eq(1)")
        let bowlerMadien = $2(bowlingTable[d]).find("td:eq(2)")
        let bowlerRuns = $2(bowlingTable[d]).find("td:eq(3)")
        let bowlerWicket = $2(bowlingTable[d]).find("td:eq(4)")
        let bowlerEconomy = $2(bowlingTable[d]).find("td:eq(5)")
        let bowlerWide = $2(bowlingTable[d]).find("td:eq(9)")
        let bowlerNoBall = $2(bowlingTable[d]).find("td:eq(10)")
        if(bowlerName.text()!="See all photos"){
          console.log(bowlerName.text()+"  "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())
          
        }
      }


      console.log("----------------")
      console.log(team2_full_name)
      console.log("----------------")
      console.log("Batsman    R   B   4s  6s  Sr")
      console.log("----------------")


      let table_2 = $2(".ci-scorecard-table:eq(1)")
    const rows_2 = table_2.find('tbody tr');

   

    rows_2.each((index, row) => {
        const batsman = $2(row).find('.ds-w-0.ds-whitespace-nowrap span:eq(0)');
        const runs = $2(row).find('strong')
        const balls = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(1)')
        const fours = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(3)')
        const sixes = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(4)')
        const strikeRate = $2(row).find('.ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right:eq(5)')


        if(batsman.text()!=""){
          console.log(batsman.text() +"   "+ runs.text()+" | "+balls.text()+" | "+fours.text()+" | "+sixes.text()+" | "+strikeRate.text())
        }

      });

      console.log("-----------")
      console.log("Bowling   O   M   R   W   Eco   Wd   Nb")
      console.log("-----------")
     let bowlingTable_2 = $2("tbody:eq(3) tr")
      for (let d=0;d<bowlingTable_2.length;d++){
           
        let bowlerName = $2(bowlingTable_2[d]).find("td:eq(0) a span")
        let bowlerOvers = $2(bowlingTable_2[d]).find("td:eq(1)")
        let bowlerMadien = $2(bowlingTable_2[d]).find("td:eq(2)")
        let bowlerRuns = $2(bowlingTable_2[d]).find("td:eq(4)")
        let bowlerWicket = $2(bowlingTable_2[d]).find("td:eq(3)")
        let bowlerEconomy = $2(bowlingTable_2[d]).find("td:eq(5)")
        let bowlerWide = $2(bowlingTable_2[d]).find("td:eq(9)")
        let bowlerNoBall = $2(bowlingTable_2[d]).find("td:eq(10)")
        if(bowlerName.text()!="See all photos"){
          console.log(bowlerName.text()+"  "+bowlerOvers.text() +" | "+bowlerMadien.text()+" | "+bowlerRuns.text()+" | "+bowlerWicket.text()+" | "+bowlerEconomy.text()+" | "+bowlerWide.text()+" | "+bowlerNoBall.text())
        }
      }

                })
  
  
  */


app.listen(5050,(req,res) => {
    console.log(`This is backend`)
})