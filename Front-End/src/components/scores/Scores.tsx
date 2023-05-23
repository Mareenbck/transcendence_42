import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import '../../style/Scores.css';
import UserChart from './UserChart'
import Fetch from "../../interfaces/Fetch"
import {UserScore, Games} from '../../interfaces/iChat'
import Card from "../../components/utils/Card";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ButtonToggle from '../utils/ButtonToggle';
import { Link, Navigate, useNavigate } from "react-router-dom";


const Scores = () => {
  // const MAX_SCORE = 3;
  // const [games, setGames] = useState<Games[]>([]);
  // const [allUsers, setAllUsers] = useState <UserScore[]> ([]);
  
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  //aller chercher les games
  // async function fetchGames() {
  //   try {
  //     setGames(await Fetch.fetch(authCtx.token, "GET",`game`))
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchGames();
  // }, []);


  // //aller chercher les users
  // async function getAllUsers() {
  //   try {
  //     setAllUsers(await Fetch.fetch(authCtx.token, "GET", `users\/games`));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  //score/ user
  // const getScore = (user: UserScore): any=> {
  //   if (games) {
  //     const p1 = games.filter((u: Games) => +u.playerOneId === +user.id).length;
  //     const p2 = games.filter((u: Games) => +u.playerTwoId === +user.id).length;
  //     const win = games.filter((u: Games) => +u.winnerId === +user.id).length;
  //     let total:number = win * MAX_SCORE - (p1 + p2 - win);
  
  //     if (total < 0)
  //       total = 0; Podium
   
  //     return (total);
  //   }
  // }
 
  // var sorted = [...allUsers];
  // sorted.sort((a, b) => (getScore(b) - getScore(a)));
  // var firts = sorted[0];
  // var second = sorted[1];
  // var third = sorted[2];
  
  function handleNewGame(event: React.FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  const theme = createTheme();

		theme.typography.h3 = {
			'@media (min-width:600px)': {
			// fontSize: '8rem',
			color: '#699BF7',
			textShadow: '2px 2px #000000',
			marginTop: '3rem',
			marginBottom: '2.5rem',
			borderBottom: '5px solid black'
		},
			[theme.breakpoints.up('md')]: {
			fontSize: '4rem',
		},
	};
  
  return(

		<>
    <section className= "main">

      <SideBar title="Scores" />   
        
      <section className= "one">  
        
        <ThemeProvider theme={theme}>
          <Typography variant="h3">Leaderboard</Typography>
        </ThemeProvider>  
        <section className= "two">
          <form onSubmit={(event: any) => handleNewGame(event)}>
          
          </form>
        
          <div className="pos">
                    
            <div className='card-wrapper'>
              <Card  calssName="cardP" color='red' title="Podium" type="podium" width="100%" ></Card>
            </div>

            <div className='card-wrapper'>
              <Card  calssName="cardPodium" color='yellow' title="Players List" type="table" width="100%" ></Card>
            </div>

          </div>  
        </section>
      </section>

    </section>  

     
    <div>
            {!isLoggedIn && <Navigate to="/" replace={true} />}
    </div> 
  
        
		<ButtonToggle/>
	</>
  )
}


export default Scores;
