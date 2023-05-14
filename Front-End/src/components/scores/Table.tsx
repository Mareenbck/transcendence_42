import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import '../../style/Scores.css';
// import UserChart from './UserChart'
import Fetch from "../../interfaces/Fetch"
import MyAvatar from '../user/Avatar';
import {UserScore, TypeGames} from "../../interfaces/iChat";
// import Card from "../../components/utils/Card";
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import '../../style/Table.css'

const Table = (props: any) => {
  const MAX_SCORE = 3;
  const [games, setGames] = useState<TypeGames[]>([]);
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
  const getNbGames = (user: UserScore) => {
    if (games) {
      const p1 = games.filter((u: TypeGames) => +u.playerOneId === +user.id);
      const p2 = games.filter((u: TypeGames) => +u.playerTwoId === +user.id);
      return (p2.length + p1.length);
    }
  }

  const getWinner = (user: UserScore) => {
    if (games) {
      return ((games.filter((u: TypeGames) => +u.winnerId === +user.id).length));
    }
  }

  const getScore = (user: UserScore): any=> {
    if (games) {
      const p1 = games.filter((u: TypeGames) => +u.playerOneId === +user.id).length;
      const p2 = games.filter((u: TypeGames) => +u.playerTwoId === +user.id).length;
      const win = games.filter((u: TypeGames) => +u.winnerId === +user.id).length;
      let total:number = win * MAX_SCORE - (p1 + p2 - win);
  
      if (total < 0)
        total = 0; 
   
      return (total);
    }
  }
  
  var sorted = [...allUsers];
  sorted.sort((a, b) => (getScore(b) - getScore(a)));
  let firts = sorted[0];
  let second = sorted[1];
  var third = sorted[2];
  
  function handleNewGame(event: React.FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }
  
    return(

    <>
      <form onSubmit={(event) => handleNewGame(event)}></form>
             
        <ListItem  className="headTable">
            <p>Avatar</p>
            <p className='tdd'>Name</p>
            <p>Games</p>
            <p>Points</p>
            <p>Victory</p>
        </ListItem >

        {sorted.map((g) => (
            <ListItem  className="lineTable" key={g?.id}>
              <div className="container-match">
                  <span ><MyAvatar authCtx={authCtx } id={g.id} style="s" avatar={g.avatar} ftAvatar={g.ftAvatar}/></span>
                  <p >{g?.username}</p>
                  <p >{getNbGames(g)}</p>
                  <p >{getScore(g)}</p>
                  <p >{getWinner(g)}</p>
              </div>
            </ListItem>
        ))}


        </>
    )
  }


export default Table;