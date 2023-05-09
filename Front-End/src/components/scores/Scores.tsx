import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from '../../style/Menu.module.css';
import '../../style/Scores.css';
import UserChart from './UserChart'
import Fetch from "../../interfaces/Fetch"
import MyAvatar from '../user/Avatar';
import {UserScore, Game} from "../interfaces/iChat";
import Card from "../../components/utils/Card";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ButtonToggle from '../utils/ButtonToggle';




// import Table from "./Table";

const Scores = () => {
  const MAX_SCORE = 3;
  const [games, setGames] = useState<Game[]>([]);
  const [allUsers, setAllUsers] = useState <UserScore[]> ([]);
  
  const authCtx = useContext(AuthContext);

  //aller chercher les games
  async function fetchGames() {
    try {
      setGames(await Fetch.fetch(authCtx.token, "GET",`game`))
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);

  //aller chercher les users
  async function getAllUsers() {
    try {
      setAllUsers(await Fetch.fetch(authCtx.token, "GET", `users\/games`));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  //score/ user


  const getScore_ = (user: UserScore) => {
    if (games) {
      const p1 = games.filter((u: { playerOneId: string | number; }) => +u.playerOneId === +user?.id);
      const p2 = games.filter((u: { playerTwoId: string | number; }) => +u.playerTwoId === +user?.id);
      const w = games.filter((u: { winnerId: string | number; }) => +u.winnerId === +user?.id);
      let total:number = 0;
      return (total);
    }
  }

  const getScore = (user: UserScore) => {
    if (games) {
      const p1 = games.filter(u => +u.playerOneId === +user.id).length;
      const p2 = games.filter(u => +u.playerTwoId === +user.id).length;
      const win = games.filter(u => +u.winnerId === +user.id).length;
      let total:number = win * MAX_SCORE - (p1 + p2 - win);
      if (total < 0)
        total = 0; 
      return (total);
    }
  }
  // console.log("fffffffffff");
 
  var sorted = [...allUsers];
  //console.log("sorted", sorted);
  sorted.sort((a, b) => (getScore(b) - getScore(a)));
  let firts = sorted[0];
  let second = sorted[1];
  var third = sorted[2];
  
  function handleNewGame(event: React.FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  const theme = createTheme();

		theme.typography.h3 = {
			// fontSize: '8rem',
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
			<ButtonToggle/>
			</>
    )
    }


export default Scores;
