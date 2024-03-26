import './App.css';
//const cheerio = require('cheerio')
import React,{useState,useEffect} from "react";
import { BrowserRouter as Router,Routes, Route,Link,Navigate,useNavigate } from "react-router-dom"

import axios from 'axios';
import Home from './home';
import Scoreboard from './scoreboard';



//const cheerio = require('cheerio')

function App() {

   return <>
   <Router>       

     <Routes>
        {/*<Route exact path='/' element={user_detail?<Home/>:<Signup/>}>  </Route>*/}
         <Route exact path='/' element={<Home/>}>  </Route>
         <Route path="/scoreboard/:id" element={<Scoreboard/>}></Route>
     </Routes>

 </Router>
      </>  
}

export default App;





{/* 


 {data.map((data)=>{
         return(
            <div className='score_div'>
            <div className='scorecard_div'>
               <div className='scorecard_div_match_info'>
                  <ul>
                     <li><span>RESULT</span></li>
                     <li><span>29th Match</span></li>
                     <li><span>World Cup 2023</span></li>
                     <li><span>ODI</span></li>
                     <li><span>Lucknow</span></li>
                 
                  </ul>
               </div>
               <div className='scorecard_div_team1_score'>
                 
                  <span> 
                     <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313100/313128.logo.png"></img>
                      {data.team1}
                  </span>
                  <span>{data.team1_score}</span>
               </div>
               <div className='scorecard_div_team2_score'>
                  <span>
                   <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313100/313114.logo.png "></img>
                     {data.team2}</span>
                  <span>{data.team2_score}</span>
               </div>
               <div className='scorecard_div_match_result'>
                  <p>{data.matchResult}</p>
               </div>
               <hr></hr>
               <div className='scorecard_div_footer'>
                  <ul className='scorecard_div_footer_ul'>
                     <li>Schedule</li>
                     <li>Table</li>
                     <li>Report</li>
                     <li>Series</li>
                  </ul>
               </div> 
            </div>
            <div className='scorecard_div'>
               
            </div>
      </div>
         )

      })}



*/}