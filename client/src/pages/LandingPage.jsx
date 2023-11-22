/* eslint-disable*/ 
import React from 'react'
import {Link} from "react-router-dom"

function LandingPage() {
  return (
    <div className="container">
      <h1>Landing page</h1>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </div>
  )
}

export default LandingPage