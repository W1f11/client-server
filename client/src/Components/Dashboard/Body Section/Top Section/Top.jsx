import React from 'react'
import './top.css'
import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";

import img from '../../../../Assets/pic2.jpg'


const Top = ()=> {
    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welocome to Planti</h1>
                    <p>Hello, Welcome back!!!</p>
                </div>

                <div className="searchBar flex">
                    <input type="text" placeholder='Search Dashboard'/>
                    <BiSearchAlt className='icon'/>
                </div>

                <div className="adminDiv flex">
                    <TbMessageCircle className='icon'/>
                    <IoNotificationsOutline className='icon'/>
                    <div className="adminImage">
                        <img src={img} alt="Admin Imgage" />
                    </div>
                </div>
            </div>

            <div className="cardSection flex">
                

                <div className="leftCard flex">
                   

                    <div className="sideBarCard">
                        <BsQuestionCircle className="icon"/>
                        <div className="cardContent">
                            <div className="circle1"></div>
                            <div className="circle2"></div>
                            <h3>Help Center</h3>
                            <p>Having trouble in Planti, please contact us for more questions.</p>
                            <button className='btn'> Go to Help Center </button>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Top