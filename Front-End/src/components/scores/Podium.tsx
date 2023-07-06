import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import '../../style/Scores.css';
import UserChart from './UserChart'
import Fetch from "../../interfaces/Fetch"
import MyAvatar from '../user/Avatar';
import {UserScore, Games} from "../../interfaces/iChat";
import '../../style/Profile.css'
import '../../style/Table.css'

const Podium = (props: any) => {
  const MAX_SCORE = 3;
  const [games, setGames] = useState<Games[]>([]);
  const [allUsers, setAllUsers] = useState <UserScore[]> ([]);

  const authCtx = useContext(AuthContext);

  async function fetchGames() {
    try {
      setGames(await Fetch.fetch(authCtx.token, "GET",`game`))
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchGames();
  },[]);

  async function getAllUsers() {
    try {
      setAllUsers(await Fetch.fetch(authCtx.token, "GET", `users\/games`));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllUsers();
  },[]);


  const getScore = (user: UserScore): any => {
    if (games && user) {
      const p1 = games.filter((u: Games) => +u.playerOneId === +user?.id).length;
      const p2 = games.filter((u: Games) => +u.playerTwoId === +user?.id).length;
      const win = games.filter((u: Games) => +u.winnerId === +user?.id).length;
      let total:number = win * MAX_SCORE - (p1 + p2 - win);
      if (total < 0)
        total = 0;
      return (total);
    }

  }

  if (!allUsers){
    fetchGames();
    getAllUsers();
  }

    var sorted = [...allUsers];
    sorted.sort((a, b) => (getScore(b) - getScore(a)));
    var firts = sorted[0];
    var second = sorted[1];
    var third = sorted[2];


  return(
    <>
        <div className="midPos">
            <div className={`rangAvatar ${getScore(firts) === getScore(second) ? "" : "podium-first"}`}>
                <MyAvatar authCtx={authCtx} id={second?.id} style="m" avatar={second?.avatar} ftAvatar={second?.ftAvatar}/>
                <UserChart userName={second?.username} h={getScore(second)} />
                <p className="rank-podium">2</p>
            </div>
            <div className='rangAvatar - one'>
                <MyAvatar authCtx={authCtx } id={firts?.id} style="m" avatar={firts?.avatar} ftAvatar={firts?.ftAvatar}/>
                <UserChart   userName={firts?.username}  h={(getScore(firts))} />
                <p className="rank-podium">1</p>
            </div>
            <div className={`rangAvatar ${getScore(firts) === getScore(third) ? "" : "podium-first"}`}>
                <MyAvatar authCtx={authCtx } id={third?.id}  style="m" avatar={third?.avatar} ftAvatar={third?.ftAvatar}/>
                <UserChart  userName={third?.username}  h={(getScore(third))} color={"black"}/>
                <p className="rank-podium">3</p>
            </div>
        </div>

      </>
  )
}


export default Podium;
