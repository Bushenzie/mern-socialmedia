/* eslint-disable */
import { useState,useEffect,useContext } from 'react'
import axios from 'axios'
import { Link,useNavigate } from "react-router-dom"
import { Input } from '../../components'
import { authContext } from '../../contexts/authContext'
import "./LoginPage.scss"

function LoginPage() {

  const { user,setUser } = useContext(authContext)
  const navigate = useNavigate();
  const [formData,setFormData] = useState(null);

  async function submitForm(e) {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3001/auth/login",formData,{
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      const data = await response.data;
      
      if(data.msg === "OK") {
        setUser(data.user);
        navigate("/");
      }
    } catch(err) {
      throw new Error(err);
    }
  }

  return (
    <div className="login-page">
      <form className="form" onSubmit={submitForm}>
        <h4>Login</h4>
        <Input inputName="email" type="email" onChange={(e) => {setFormData({...formData,email: e.target.value})}} required/>
        <Input inputName="password" type="password" onChange={(e) => {setFormData({...formData,password: e.target.value})}}  required/>
        <button type="submit" className="btn primary">Login</button>
        <p>Not a user? <Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default LoginPage