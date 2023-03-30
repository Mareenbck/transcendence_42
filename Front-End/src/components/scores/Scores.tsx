import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from '../../style/Menu.module.css';
import '../../style/Scores.css';


import JeuApi from "../../pages/Scores/scores.api";
//import JeuApi from "./scores.api"
//import JeuDto from "./scores.dto"
import { JeuDto } from "../../pages/Scores/scores.dto";

import UserChart from '../auth/UserChart'




const Scores = () => {
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
  const authCtx = useContext(AuthContext);
  const [list, setList] = useState<response[]> ([]);
  const [avatar, setAvatar] = useState<string | null>(null);


  useEffect(() => {
		setAvatar(authCtx.avatar);
	}, [authCtx.avatar]);

  /*const [jeux, setJeux] = useState<JeuDto[]> ([]);

  useEffect(() => {
    async function getJeux() {
      try {
        const response = await JeuApi.getJeux();
        setJeux(response);
      } catch(err) {
        console.log(err);
      }
    };
    getJeux();
    }, []);*/

    return(
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

     )
  }


export default Scores;
