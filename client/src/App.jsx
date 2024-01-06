/* eslint-disable */
import { useState,useContext, useEffect } from 'react';
import { ChatPage,FeedPage,FriendsPage,LandingPage,LoginPage,NotFoundPage,ProfilePage,RegisterPage, SettingsPage, UnloggedSharedLayout } from './pages';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider,authContext } from './contexts/authContext';
import "./styles/main.scss"


function App() {
  const { user } = useContext(authContext)

  console.log(user)

  return (
    <AuthContextProvider>
      <BrowserRouter>
          <Routes>
            {!user ? 
              <>
                <Route path="/" element={<UnloggedSharedLayout />}>
                  <Route index element={<LandingPage/>} />
                  <Route path="login" element={<LoginPage />}/>
                  <Route path="register" element={<RegisterPage />}/>
                </Route>
              </>
              :
              <>
                <Route path="/" element={<FeedPage />}/>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/settings" element={<SettingsPage />}/>
                <Route path="/friends" element={<FriendsPage />}/>
                <Route path="/chat" element={<ChatPage />}/>
              </>
            }
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
