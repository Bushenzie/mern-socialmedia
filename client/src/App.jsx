/* eslint-disable */
import { useState } from 'react';
import { ChatPage,FeedPage,FriendsPage,LandingPage,LoginPage,ProfilePage,RegisterPage } from './pages';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/feed" element={<FeedPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/friends" element={<FriendsPage />}/>
          <Route path="/chat" element={<ChatPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
