import React, { useState, useContext, useEffect } from 'react';
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
  const [selectedMenu, selectMenu] = useState('clients');
  return (
    <header>
      {isDrawerOpen && (
        <Drawer handleClose={toggleDrawer}>
          <header className='mb-12 p-0'>
            <button
              onClick={() => selectMenu('clients')}
              className={selectedMenu === 'clients' ? 'underline m-0' : 'm-0'}>
              Clients
            </button>
            <button
              onClick={() => selectMenu('settings')}
              className={selectedMenu === 'settings' ? 'underline m-0' : 'm-0'}>
              Settings
            </button>
          </header>
          {selectedMenu === 'settings' ? (
            <section>
              <Switch label='Dark Mode' bool={dark} toggle={toggleDark} />
            </section>
          ) : (
            <section>
              <Roster toggleDrawer={toggleDrawer} />
              <Link to='/'>
                <button className='btn-two mt-24' onClick={toggleDrawer}>
                  Workouts
                </button>
              </Link>
            </section>
          )}
        </Drawer>
      )}
      {isAuthenticated && (
        <>
          <button className='hover-underline' onClick={toggleDrawer}>
            Menu
          </button>
          <button className='hover-underline' onClick={() => logUserOut()}>
            Logout
          </button>
        </>
      )}
    </header>
  );
};

export default Navbar;
