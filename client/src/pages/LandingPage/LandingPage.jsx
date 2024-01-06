/* eslint-disable*/ 
import React from 'react'
import {Link} from "react-router-dom"
import "./LandingPage.scss"
import IphoneImage from "../../assets/iphone-image.png"

function LandingPage() {
  return (
    <div className="landing-page">
      <main className="main">
        <div className="content">
          <div className="right">
            <h1>
              Social Site Project
            </h1>
            <p className="p2">
              Social network site build using MERN technology stack from scratch!
            </p>
            <Link className="btn primary" to="/register">Register</Link>
            <p>Already member? <Link to="/login">Log In</Link></p>
          </div>
          <div className="left">
            <img src={IphoneImage} alt="Floating iphone image" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage