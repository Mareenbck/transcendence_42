import React, { FormEvent, useEffect, useRef, useState } from 'react';
import '../../style/Scores.css';
import { Link } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import { useContext } from "react";
import SideBar from '../../components/auth/SideBar';
import style from '../../style/Menu.module.css'
import JeuReq from "./scores.req"

function Score() {

const [jeux, setJeux] = useState ([]);

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


const Scores = () => {
    return(
        <div className= {style.mainPos}>
          <SideBar title="Scores" />
          <h1 className={style.title}>PONDIUM</h1>        
        </div>        
     )           
  }
}

export default Score;
