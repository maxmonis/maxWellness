import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Switch } from '../layout/UI';
import AuthContext from '../../context/auth/authContext';
import ClientContext from '../../context/client/clientContext';

const Navbar = ({ dark, toggleDark }) => {
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
      {isAuthenticated ? (
        <>
          <button className='hover-underline' onClick={() => logUserOut()}>
            Logout
          </button>
          <Switch
            classes='lightswitch'
            bool={!dark}
            toggle={toggleDark}
            tooltipContent={`Turn ${dark ? 'on' : 'off'} the lights`}
          />
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
