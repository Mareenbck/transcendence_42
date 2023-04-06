import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from '../../style/Menu.module.css';
import '../../style/Scores.css';
import UserChart from './UserChart'
import ChatReq from "./../chat/Chat.req"

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

//////////////////////////////////////////////









  //1, defination state as Array exp:post: []
  const response =[
    {id : 1, UserName: "Saray", UserScore: 4, avatar:"https://img.freepik.com/free-vector/cute-cat-gaming-cartoon_138676-2969.jpg?w=1380&t=st=1679757816~exp=1679758416~hmac=002bb79ee845ba4f3302e999096caf21b38d9583f0664b172d73f6802a2a7c9e"},
    {id : 2, UserName: "Maryia", UserScore: 10, avatar:"https://img.freepik.com/free-vector/cute-sloth-with-coffee-cup-cartoon-vector-icon-illustration-animal-drink-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3490.jpg?t=st=1679731777~exp=1679732377~hmac=a30e0f754a12a119953d80e2c36a63ceb544f68c016dcdbedaaece57aec67afe"},
    {id : 3, UserName: "Emma", UserScore: 7, avatat:"https://img.freepik.com/free-photo/studio-portrait-successful-young-businesswoman_1262-5844.jpg?w=1800&t=st=1679763735~exp=1679764335~hmac=29da3c3a6b0298d67f786f52fe17827e6787f6507b59f8914c7b1d58c105393d"},
    {id : 4, UserName: "Theo", UserScore: 9, avatar:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1380&t=st=1679762814~exp=1679763414~hmac=011a3d5fd8df6191d6fff8a374227b24086bb49757da6ada63848360304a5525"},
    {id : 5, UserName: "Marine", UserScore: 3, avatar:"https://img.freepik.com/free-photo/studio-portrait-successful-young-businesswoman_1262-5844.jpg?w=1800&t=st=1679763735~exp=1679764335~hmac=29da3c3a6b0298d67f786f52fe17827e6787f6507b59f8914c7b1d58c105393d"},
  ];

  //2, I have an Array from API = > response
  // setstate({ post: response.data})
  // const authCtx = useContext(AuthContext);
  const [list, setList] = useState<response[]> ([]);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
		setAvatar(authCtx.avatar);
	}, [authCtx.avatar]);

/////////////////////////////////////////////
// ancien render de la page SCORE
/*
 <div className= {style.mainPos}>
          <SideBar title="Scores" />
          <div className="midPos">
            <h1 className={style.title}>PONDIUM</h1>
            <hr width="100%" color="green" />
            <div className="pos">
                {response.map( (id ) => {
                  return(
                    <UserChart key={id} image ={id.avatar} userName={id.UserName}  h={(id.UserScore)}/>
                  )
                })
              }
            </div>
          </div>

        </div>
*/
////////////////////////////////////////////////////
    return(


    <>
<form onSubmit={(event) => handleNewGame(event)}>
    <button type="submit" className='add-friend'><i className="fa-solid fa-user-plus"></i></button>
</form>
      <div>
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

      <div>
        <table>
          <thead>
            <tr>
              <th colSpan="2"> The hall of fame </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User</td>
              <td>Nbre de parties</td>
              <td>Nombre total de points</td>
              <td>Nombre total de victoires</td>
            </tr>
          { allUsers.map((g) => (
            <tr key={g?.id} >
              <td>{g?.username}</td>
              <td>{getNbGames(g)}</td>
              <td>{getScore(g)}</td>
              <td>{getWinner(g)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
     
     

     
      <div className="pos">
                {allUsers.map( (g) => {
                  return(
                    <UserChart key={g?.id} userName={g?.username}  h={(getScore(g))}/>
                  )
                })
              }

        </div>
        </>
    )
    }


export default Scores;
