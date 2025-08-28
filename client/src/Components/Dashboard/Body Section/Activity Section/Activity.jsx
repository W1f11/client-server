import React from 'react'
import './activity.css'
import { BsArrowRightShort } from "react-icons/bs";

import img from '../../../../Assets/p1.jpg'
import img1 from '../../../../Assets/p2.jpg'
import img2 from '../../../../Assets/p3.jpg'
import img3 from '../../../../Assets/p4.jpg'
import img4 from '../../../../Assets/p5.jpg'

const Activity = ()=> {
    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Resent Activity</h1>
                <button className="btn flex">
                    See All
                    <BsArrowRightShort className='icon'/>
                </button>
            </div>
            <div className="secContainer grid">
                <div className="singleCustomer flex">
                    <img src={img} alt="Customer Inage" />
                    <div className="customerDetails">
                        <span className='name'>Alia</span>
                        <small>Ordered a new plant</small>
                    </div>
                    <div className='duration'>
                        2 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={img1} alt="Customer Inage" />
                    <div className="customerDetails">
                        <span className='name'>Rohan</span>
                        <small>Ordered a new plant</small>
                    </div>
                    <div className='duration'>
                        5 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={img2} alt="Customer Inage" />
                    <div className="customerDetails">
                        <span className='name'>Samantha</span>
                        <small>Ordered a new plant</small>
                    </div>
                    <div className='duration'>
                        6 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={img3} alt="Customer Inage" />
                    <div className="customerDetails">
                        <span className='name'>Rachel</span>
                        <small>Ordered a new plant</small>
                    </div>
                    <div className='duration'>
                        10 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={img4} alt="Customer Inage" />
                    <div className="customerDetails">
                        <span className='name'>Juli</span>
                        <small>Ordered a new plant</small>
                    </div>
                    <div className='duration'>
                        20 min ago
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Activity