import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Roster from '../roster/Roster';
import { Drawer, Switch } from '../layout/UI';
import AuthContext from '../../context/auth/authContext';
import ClientContext from '../../context/client/clientContext';

const Navbar = ({ dark, toggleDark, isDrawerOpen, toggleDrawer }) => {
  const { isAuthenticated, logUserOut, loadUser, user } =
    useContext(AuthContext);
  const { getClients, clearClients } = useContext(ClientContext);
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    user ? getClients() : clearClients();
    // eslint-disable-next-line
  }, [user]);
  return (
    <header>
      {isDrawerOpen && (
        <Drawer handleClose={toggleDrawer}>
          <section className='mb-24'>
            <h2>Settings</h2>
            <div className='menu-drawer'>
              <Switch label='Dark Mode' bool={dark} toggle={toggleDark} />
            </div>
          </section>
          <section>
            <h2>Clients</h2>
            <Roster toggleDrawer={toggleDrawer} />
          </section>
          <Link className='link' to='/'>
            <button className='btn-two mt-24' onClick={toggleDrawer}>
              My Workouts
            </button>
          </Link>
        </Drawer>
      )}
      {isAuthenticated ? (
        <>
          <button className='hover-underline' onClick={toggleDrawer}>
            Menu
          </button>
          <button className='hover-underline' onClick={() => logUserOut()}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to='login'>
            <button className='hover-underline'>Login</button>
          </Link>
          <Link to='register'>
            <button className='hover-underline'>Register</button>
          </Link>
        </>
      )}
    </header>
  );
};

export default Navbar;
