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
import '../../style/Profile.css'
import '../../style/Table.css'




const Podium = (props: any) => {
  const MAX_SCORE = 10;
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


  const getScore = (user: UserScore) => {
    if (games) {
      const p1 = games.filter((u: { playerOneId: string | number; }) => +u.playerOneId === +user?.id);
      const p2 = games.filter((u: { playerTwoId: string | number; }) => +u.playerTwoId === +user?.id);
      const w = games.filter((u: { winnerId: string | number; }) => +u.winnerId === +user?.id);
      let total:number = 0;
      let totalWin:number = 0;
      let totalPerd:number = 0;
      if (p1.length > 0) {total = p1.reduce((score: number, game: { score1: string | number; }) => score = score + +game.score1, 0)};
      if (p2.length > 0) {total = total + p2.reduce((score: number, game: { score2: string | number; }) => score = score + +game.score2, 0)};
      if (w.length > 0) {totalWin = w.length * MAX_SCORE};
      totalPerd = total - totalWin;
      total = totalWin - totalPerd;
      if (total < 0) 
        total = 0;
      return (total);
    }
  }
 
 
  var sorted = [...allUsers];
  //console.log("sorted", sorted);
  sorted.sort((a, b) => (getScore(b) - getScore(a)));
  let firts = sorted[0];
  let second = sorted[1];
  var third = sorted[2];
  
 // console.log("wqwretyt", firts?.avatar);
    return(

    <>
           	<div className="midPos">
                <div className={`rangAvatar ${getScore(firts) === getScore(second) ? "" : "podium-first"}`}>
                    <MyAvatar authCtx={authCtx} id={second?.id} style="m" avatar={second?.avatar} ftAvatar={second?.ftavatar}/>
                    <UserChart userName={second?.username} h={getScore(second)} />

                    <p className="rank-podium">2</p>

                </div>

                <div className='rangAvatar - one'>       
                    <MyAvatar authCtx={authCtx } id={firts?.id} style="m" avatar={firts?.avatar} ftAvatar={firts?.ftavatar}/>
                    <UserChart   userName={firts?.username}  h={(getScore(firts))} />
                    <p className="rank-podium">1</p>

                </div>

                <div className={`rangAvatar ${getScore(firts) === getScore(third) ? "" : "podium-first"}`}>
                    <MyAvatar authCtx={authCtx } id={third?.id}  style="m" avatar={third?.avatar} ftAvatar={third?.ftavatar}/> 
                    <UserChart  userName={third?.username}  h={(getScore(third))} color={"black"}/>
                    <p className="rank-podium">3</p>
                </div>
            </div>
 


        </>
    )
    }


export default Podium;