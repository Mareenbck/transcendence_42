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

const Scores = () => {
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
  const getNbGames = (user: UserScore) => {
    if (games) {
      const p1 = games.filter(u => +u.playerOneId === +user.id);
      const p2 = games.filter(u => +u.playerTwoId === +user.id);
      return (p2.length + p1.length);
    }
  }

  const getWinner = (user: UserScore) => {
    if (games) {
      return (games.filter(u => +u.winnerId === +user.id).length);
    }
  }

  const getScore = (user: UserScore) => {
    if (games) {
      const p1 = games.filter(u => +u.playerOneId === +user.id);
      const p2 = games.filter(u => +u.playerTwoId === +user.id);
      let total:number = 0;
      if (p1.length > 0) {total = p1.reduce((score, game) => score = score + +game.score1, 0)};
      if (p2.length > 0) {total = total + p2.reduce((score, game) => score = score + +game.score2, 0)};
      return (total);
    }
  }
 
 
  var sorted = [...allUsers];
  //console.log("sorted", sorted);
  sorted.sort((a, b) => (getScore(b) - getScore(a)));
  let firts = sorted[0];
  let second = sorted[1];
  var third = sorted[2];
  
  function handleNewGame(event: React.FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }
  
 // console.log("wqwretyt", firts?.avatar);
    return(

    <>
   <div >
    <section className= "main">

      <SideBar title="Scores" />          
    
      <section className= "one">  
          <h1 className='one_podium'>PODIUM</h1>
          
          <section className= "two">
          <form onSubmit={(event) => handleNewGame(event)}>
         
        </form>
           
              <div>
                
                <table className='table'>
                  <thead className='thead'>
                     <tr>
                      <td>User</td>
                      <td>Nbre de parties</td>
                      <td>Nombre total de points</td>
                      <td>Nombre total de victoires</td>
                      <td> avatar</td> 
                    </tr>
                  </thead>
                  <tbody>

                  { sorted.map((g) => (
                    <tr key={g?.id} >
                      <td>{g?.username}</td>
                      <td>{getNbGames(g)}</td>
                      <td>{getScore(g)}</td>
                      <td>{getWinner(g)}</td>
                      <td><MyAvatar authCtx={authCtx } id={g.id} style="s" avatar={g.avatar} ftAvatar={g.ftavatar}/></td>
                    </tr>
                  ))}
                  </tbody>
                </table>
            </div>
            <div className="pos">
                    
             
              <div className="midPos">

                    <div className='rangAvatar'>
                      <UserChart   userName={second?.username}  h={(getScore(second))} />
                      <MyAvatar authCtx={authCtx } id={second?.id} style="l" avatar={second?.avatar} ftAvatar={second?.ftavatar}/>
                    </div>

                    <div className='rangAvatar'>       
                      <UserChart   userName={firts?.username}  h={(getScore(firts))} />
                      <MyAvatar authCtx={authCtx } id={firts?.id} style="l" avatar={firts?.avatar} ftAvatar={firts?.ftavatar}/>
                    </div>

                    <div className='rangAvatar'> 
                      <UserChart   userName={third?.username}  h={(getScore(third))} color={"black"}/>
                      <MyAvatar authCtx={authCtx } id={third?.id}  style="l" avatar={third?.avatar} ftAvatar={third?.ftavatar}/> 
                    </div>
                  
                  </div>


                  </div>  
                </section>
            </section>

          </section>    
          </div>

        </>
    )
    }


export default Scores;
