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
    const [jeux, setJeux] = useState<JeuDto[]> ([]);

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
    }, []);
    
    return(

       <div className= {style.mainPos}>
          <SideBar title="Scores" />  
          <div className="midPos">
            <h1 className={style.title}>PONDIUM</h1> 
            <div className="pos">
                <UserChart />
                <UserChart /> 
            </div> 
          </div>    
        </div>        
     )           
  }


export default Scores;
