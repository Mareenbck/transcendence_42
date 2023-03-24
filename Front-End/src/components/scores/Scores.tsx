import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../auth/SideBar';
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
    {id : 1, UserName: "saray", UserScore: 1},
    {id : 2, UserName: "maryia", UserScore: 10},
    {id : 3, UserName: "emma", UserScore: 7},
    {id : 4, UserName: "theo", UserScore: 9},
    {id : 5, UserName: "marine", UserScore: 3},
  ];

  //2, I have an Array from API = > response
  // setstate({ post: response.data})
  const [list, setList] = useState<response[]> ([]);

  

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

            <div className="pos">
                {response.map( (id ) => {
                  return(
                    <UserChart key={id} userName={id.UserName} />
                  )
                })
              }
              <UserChart  userName="saray"/>
            </div>  
          </div>  

        </div>
            
     )           
  }


export default Scores;
