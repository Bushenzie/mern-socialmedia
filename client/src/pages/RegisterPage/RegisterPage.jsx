/* eslint-disable */
import {useState} from 'react'
import {Link} from "react-router-dom"
import "./RegisterPage.scss"
import { Input } from '../../components';

function RegisterPage() {

  const [formData, setFormData] = useState({})
  const [errMessage,setErrMessage] = useState("")

  function submitForm(e) {
    e.preventDefault();

    if(formData.password !== formData.verifyPassword) { setErrMessage("Password does not match") }
    else {setErrMessage("")}
    console.log(formData)

  }

  return (
    <div className="register-page">
      <form className="form" onSubmit={submitForm}>
        <h4>Register</h4>
        <div className="row">
          <Input inputName="firstName" type="text" onChange={(e) => {setFormData({...formData,firstName: e.target.value})}} required/>
          <Input inputName="lastName" type="text" onChange={(e) => {setFormData({...formData,lastName: e.target.value})}} required/>
        </div>
        <div className="row">
          <Input inputName="email" type="email" onChange={(e) => {setFormData({...formData,email: e.target.value})}} required/>
        </div>
        <div className="row">
          <Input inputName="password" type="password" onChange={(e) => {setFormData({...formData,password: e.target.value})}} required/>
          <Input inputName="verifyPassword" type="password" onChange={(e) => {setFormData({...formData,verifyPassword: e.target.value})}} required/>
        </div>
        <div className="row">
          <Input inputName="job" type="text" onChange={(e) => {setFormData({...formData,job: e.target.value})}} />
          <Input inputName="location" type="text" onChange={(e) => {setFormData({...formData,location: e.target.value})}} />
        </div>
        <div className="row">
          <Input inputName="avatar" type="file" />
        </div>
        <p className="form-error">{errMessage}</p>
        <button type="submit" className="btn primary">Login</button>
        <p>Already user? <Link to="/login">Log In</Link></p>
      </form>
    </div>
  )
}

export default RegisterPage