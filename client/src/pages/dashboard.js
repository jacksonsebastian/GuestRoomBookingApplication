import React from 'react'
import Navbar from '../components/Navbar.js/index.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

const DashBoard = () => {
  const {logoutUser, user} = useAuthContext();
  console.log("logoutUser:", user)
  return (
    <div style={{color: '#000'}}>
      <Navbar username={user} onLogout={logoutUser} />
    </div>
  )
}

export default DashBoard;