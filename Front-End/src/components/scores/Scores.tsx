import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from '../../style/Menu.module.css';
import '../../style/Scores.css';
import UserChart from './UserChart'
import ChatReq from "./../chat/Chat.req"
import MyAvatar from '../user/Avatar';

const Scores = () => {
  //0 Ajout théo 30/03/23
  const [games, setGames] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState <UserDto[]> ([]);
  const authCtx = useContext(AuthContext);


          //aller chercher les games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const resp = await fetch( "http://localhost:3000/game/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.token}`
          }
        });
        if (!resp.ok) {
          const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
          throw new Error(message);
        }
        const data = await resp.json();
        setGames(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGames();
  }, [])

            //aller chercher les users
  async function getAllUsers(authCtx: AuthContext) {
    const resp = await ChatReq.getAllUsersWithGames(authCtx);
    setAllUsers(resp);
  };
  useEffect(() => {
    getAllUsers(authCtx);
  }, []);

              //score/ user
  const getNbGames = (user) => {
    if (games) {
      const p1 = games.filter(u => +u.playerOneId === +user.id);
      const p2 = games.filter(u => +u.playerOneId === +user.id);
      return (p1.length + p1.length);
    }
  }

  const getWinner = (user) => {
    if (games) {
      return (games.filter(u => +u.winnerId === +user.id).length);
    }
  }

  const getScore = (user) => {
    if (games) {
      const p1 = games.filter(u => +u.playerOneId === +user.id);
      const p2 = games.filter(u => +u.playerOneId === +user.id);
      let total:number = 0;
      if (p1.length > 0) {total = p1.reduce((score, game) => score = score + +game.score1, 0)};
      if (p2.length > 0) {total = total + p2.reduce((score, game) => score = score + +game.score2, 0)};
      return (total);
    }
  }

///////////////////////////////////////////
//  POUR MARIYA

  const handleNewGame = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const resp = await fetch(`http://localhost:3000/game/newGame`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({
          playerOneId: 2,
          playerTwoId: 4,
          winnerId: 2,
          score1: 1,
          score2: 10,
        }),
      });
      if (!resp.ok) {
        const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
        throw new Error(message);
      }
      const data = await resp.json();
    } catch (err) {
      console.log(err);
    }
  };

 
  //allUsers.sort((a:any , b:any) => (a.getScore < b.getScore ? -1 : 1));
  var sorted = [...allUsers];
  //console.log('first', sorted);
  sorted.sort((a, b) => (getScore(b) - getScore(a)));
  //console.log('second',sorted);
  
  var firts = sorted[0];
  var secend = sorted[1];
  var third = sorted[2];
    return(

    <>
   
    <section className= "main">

      <SideBar title="Scores" />          
    
      <section className= "one">  
          <h1>PONDIUM</h1>
          <section className= "two">
          <form onSubmit={(event) => handleNewGame(event)}>
          {/* <button type="submit" className='add-friend'><i className="fa-solid fa-user-plus"></i></button>*/}
        </form>
        {/* 
              <div >
                <table>
                  <thead>
                   <tr>
                      <th colSpan="2"> The Game List </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Index</td>
                      <td>Joueur 1</td>
                      <td>Score</td>
                      <td>Joueur 2</td>
                      <td>Score</td>
                      <td>WINNER</td>
                    </tr>
                  { games.map((g) => (
                    <tr key={g?.id} >
                      <td>{g?.id}</td>
                      <td>{g?.playerOne.username}</td>
                      <td>{g?.score1}</td>
                      <td>{g?.playerTwo.username}</td>
                      <td>{g?.score2}</td>
                      <td>{g?.winner.username}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          */}            
              <div>
                
                <table className='table'>
                  <thead className='thead'>
                   {/* <tr>
                      <th colSpan="2"> The hall of fame </th>
                    </tr> */}
                     <tr>
                      <td>User</td>
                      <td>Nbre de parties</td>
                      <td>Nombre total de points</td>
                      <td>Nombre total de victoires</td>
                      <td> avatar</td> 
                    </tr>
                  </thead>
                  <tbody>
                    {/*<tr>
                      <td>User</td>
                      <td>Nbre de parties</td>
                      <td>Nombre total de points</td>
                      <td>Nombre total de victoires</td>
                      <td> avatar</td> 
                  </tr>*/}
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
                    
              
                      {  sorted.map( (g) => {
                        return(
                          
                          <div className="midPos">
                            <div className='rangAvatar'> 
                            { secend.id == g.id && <MyAvatar authCtx={authCtx } id={secend.id} style="s" avatar={secend.avatar} ftAvatar={secend.ftavatar}/>  }
                            { secend.id == g.id &&  <UserChart key={secend?.id}   userName={secend?.username}  h={(getScore(secend))} />}

                            { firts.id == g.id && <MyAvatar authCtx={authCtx } id={firts.id} style="s" avatar={firts.avatar} ftAvatar={firts.ftavatar}/>  }
                            { firts.id == g.id &&  <UserChart key={firts?.id}   userName={firts?.username}  h={(getScore(firts))}/>}

                            { third.id == g.id && <MyAvatar authCtx={authCtx } id={third.id} style="s" avatar={third.avatar} ftAvatar={third.ftavatar}/>  }
                            { third.id == g.id &&  <UserChart key={third?.id}   userName={third?.username}  h={(getScore(third))}/>}
                             
                            </div>
                          </div>
                          
                        )
                      })
                    }

            </div>  
                </section>
            </section>

          </section>    


        </>
    )
    }


export default Scores;
