import React,{useState,useEffect} from "react";
import axios from 'axios';
import './App.css';
import { useParams } from "react-router-dom";


const Scoreboard=()=>{

    let {id} = useParams()
    

    const [team1Scorecard,setTeam1Scorecare] = useState()
    const [team1ExtrasTypes,setTeam1ExtrasTypes] = useState()
    const [team2Bowling,setTeam2Bowling] = useState()
    const [team1Total,setTeam1Total] = useState()
    const [team1RemainingBatters,setTeam1RemainingBatters] = useState([])
    const [team1FallOfWickets,setTeam1FallOfWickets] = useState()

    const [team2Scorecard,setTeam2Scorecare] = useState()
    const [team2ExtrasTypes,setTeam2ExtrasTypes] = useState()
    const [team1Bowling,setTeam1Bowling] = useState()
    const [team2Total,setTeam2Total] = useState()
    const [team2RemainingBatters,setTeam2RemainingBatters] = useState([])
    const [team2FallOfWickets,setTeam2FallOfWickets] = useState()


   /* useEffect(()=>{
        const fetchTeam1Scorecard = async()=>{
           const res = await axios.get("http://localhost:5050")
           console.log(res.data[0].team2_bowling)
           

        }
        fetchTeam1Scorecard()
       },[])*/

    useEffect(()=>{
        const fetchScoreboard=async()=>{
            const res = await axios.get(`http://localhost:5050/matches/${parseInt(id)}`)
            console.log(res.data)
            setTeam1ExtrasTypes(res.data.team1_extras)
            setTeam1Scorecare(res.data.team1_scorecard)
           setTeam2Bowling(res.data.team2_bowling)
           setTeam2Scorecare(res.data.team2_scorecard)
           setTeam2ExtrasTypes(res.data.team2_extras)
           setTeam1Bowling(res.data.team1_bowling)
           setTeam1Total(res.data.team1_total_score)
           if(res.data.team1_remaining_batters!=null){
            setTeam1RemainingBatters(res.data.team1_remaining_batters)
           }
           if(res.data.team2_remaining_batters!=null){
            setTeam2RemainingBatters(res.data.team2_remaining_batters)
           }
           if(res.data.team1_fall_of_wicket!=null){
            setTeam1FallOfWickets(res.data.team1_fall_of_wicket)
           }
           if(res.data.team2_fall_of_wicket!=null){
            setTeam2FallOfWickets(res.data.team2_fall_of_wicket)
           }
           setTeam2Total(res.data.team2_total_score)

        }
        fetchScoreboard()
    },[id])

    return<>
        
    <div>
        <div className='header'>
        <img className='logo_img' src="https://www.espncricinfo.com/static/images/espncricinfo-logo-full.png"></img>
        </div>

        <div className="team1_scoreboard">
            <div className="team1_scoreboard_name_header">
                <h2>India</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>BATTING</th>
                        <th></th>
                        <th>R</th>
                        <th>B</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                    </tr>
                </thead>

                <tbody>
                    {team1Scorecard?.map((player)=>{
                        return<>
                                    <tr>
                                        <td>{player.batsman}</td>
                                        <td>{player.batsman_status} </td>
                                        <td>{player.batsman_runs}</td>
                                        <td>{player.batsman_ball_faced}</td>
                                        <td>{player.batsman_fours}</td>
                                        <td>{player.batsman_sixes}</td>
                                        <td>{player.batsman_strike_rate}</td>
                                    </tr>
                        
                              </>
                    })}
                    <tr>
                       <td colspan="2" className="extra">Extras</td>
                       <td colspan="5">{team1ExtrasTypes}</td>
                    </tr>
                    <tr>
                        <td colspan="2">TOTAL</td>
                        <td colspan="5">{team1Total}</td>
                    </tr>
                    <tr>
                        <td colspan="7">{team1RemainingBatters?.length==0?"":`Did not bat: ${team1RemainingBatters}`} </td>
                    </tr>
                    <tr>
                        <td colspan="7"><span>Fall of wickets: </span>{team1FallOfWickets}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead className="bowling_table">
                    <tr>
                        <th>BOWLING</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>Econ</th>
                        <th>Wd</th>
                        <th>Nb</th>
                    </tr>
                </thead>

                <tbody>

                    {team2Bowling?.map((bowler)=>{
                        return<>
                            <tr>
                                <td>{bowler.bowler_name}</td>
                                <td className="bowling_table_over">{bowler.bowler_overs}</td>
                                <td>{bowler.bowler_maiden}</td>
                                <td>{bowler.bowler_runs}</td>
                                <td>{bowler.bowler_wicket}</td>
                                <td>{bowler.bowler_economy}</td>
                                <td>{bowler.bowler_wide}</td>
                                <td className="bowling_table_nb">{bowler.bowler_noball}</td>
                            </tr>
                              </>

                    })}
                       


                </tbody>
            </table>




        </div>



        {/*Team 2*/} 


        <div className="team1_scoreboard">
            <div className="team1_scoreboard_name_header">
                <h2>Sri Lanka</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>BATTING</th>
                        <th></th>
                        <th>R</th>
                        <th>B</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                    </tr>
                </thead>

                <tbody>
                    {team2Scorecard?.map((player)=>{
                        return<>
                                    <tr>
                                        <td>{player.batsman}</td>
                                        <td>{player.batsman_status} </td>
                                        <td>{player.batsman_runs}</td>
                                        <td>{player.batsman_ball_faced}</td>
                                        <td>{player.batsman_fours}</td>
                                        <td>{player.batsman_sixes}</td>
                                        <td>{player.batsman_strike_rate}</td>
                                    </tr>
                        
                              </>
                    })}
                    <tr>
                       <td colspan="2" className="extra">Extras</td>
                       <td colspan="5">{team2ExtrasTypes}</td>
                    </tr>
                    <tr>
                        <td colspan="2">TOTAL</td>
                        <td colspan="5">{team2Total}</td>
                    </tr>
                    <tr>
                        <td colspan="7">{team2RemainingBatters?.length==0?"":`Did not bat: ${team2RemainingBatters}`}</td>
                    </tr>
                    <tr>
                        <td colspan="7"><span>Fall of wickets: </span>{team2FallOfWickets}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead className="bowling_table">
                    <tr>
                        <th>BOWLING</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>Econ</th>
                        <th>Wd</th>
                        <th>Nb</th>
                    </tr>
                </thead>

                <tbody>

                    {team1Bowling?.map((bowler)=>{
                        return<>
                            <tr>
                                <td>{bowler.bowler_name}</td>
                                <td className="bowling_table_over">{bowler.bowler_overs}</td>
                                <td>{bowler.bowler_maiden}</td>
                                <td>{bowler.bowler_runs}</td>
                                <td>{bowler.bowler_wicket}</td>
                                <td>{bowler.bowler_economy}</td>
                                <td>{bowler.bowler_wide}</td>
                                <td className="bowling_table_nb">{bowler.bowler_noball}</td>
                            </tr>
                              </>

                    })}
                       


                </tbody>
            </table>




        </div>


        
    </div>
        
    </>
}

export default Scoreboard