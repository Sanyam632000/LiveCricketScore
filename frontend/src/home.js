import React,{useState,useEffect} from "react";
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router,Routes, Route,Link,Navigate,useNavigate } from "react-router-dom"



const Home=()=>{
  
    const [data,setData] = useState()
    const [team1_score,setTeam1Score] = useState()
    const [team1,setTeam1] = useState()
    const [team2_score,setTeam2Score] = useState()
    const [team2,setTeam2] = useState()
    const [matchResult,setMatchResult] = useState()
    const [matchInfo,setMatchInfo] = useState()

useEffect(()=>{
 const fetchcric = async()=>{
    const res = await axios.get("http://localhost:5050")
    //console.log(res.data)
    setData(res.data)
    setTeam1(res.data[0].team1)
    setTeam1Score(res.data[0].team1_score)
    setTeam2(res.data[0].team2)
    setTeam2Score(res.data[0].team2_score)
    setMatchResult(res.data[0].result)
 }
 fetchcric()
},[])

const handleClick=()=>{
    console.log(data.id)
}

 console.log(data)
return (
 <div>
    <div className='header'>
       <img className='logo_img' src="https://www.espncricinfo.com/static/images/espncricinfo-logo-full.png"></img>
    </div>

    <div className='score_div'>
    {data?.map((data)=>{
       return(
          
        <Link className="link" to={`/scoreboard/${data.id}`}>
          <div className='scorecard_div' key={data.id} onClick={() => console.log(data.id)}>
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
                   {/*<img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313100/313128.logo.png"></img>*/}
                    {data.team1}
                </span>
                <span>{data.team1_score}</span>
             </div>
             <div className='scorecard_div_team2_score'>
                <span>
                 {/*<img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313100/313114.logo.png "></img>*/}
                   {data.team2}</span>
                <span>{data.team2_score}</span>
             </div>
             <div className='scorecard_div_match_result'>
                <p>{data.result}</p>
             </div>
             <hr className="hr_line"></hr>
             <div className='scorecard_div_footer'>
                <ul className='scorecard_div_footer_ul'>
                   <li>Schedule</li>
                   <li>Table</li>
                   <li>Report</li>
                   <li>Series</li>
                </ul>
             </div> 
          </div>
          </Link>
   
       )

    })}



    </div>


    
    


   
    
 </div>
);

}

export default Home