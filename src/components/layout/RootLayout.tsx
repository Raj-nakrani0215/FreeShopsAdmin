import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSideBar from '../menuBars/sideBar';
import Header from '../menuBars/header';

const RootLayout = () => {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <LeftSideBar />
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url(assets/HomeBackground.png)',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 400px',
        backgroundColor: '#F5F5F5',
        overflow: 'hidden', // Prevent outer scrolling
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}>
          <Header />
        </div>
        <main style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout; 