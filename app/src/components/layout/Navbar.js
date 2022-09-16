import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/auth/authContext'
import ClientContext from '../../context/client/clientContext'
import MenuDrawer from './MenuDrawer'
import SideNav from './SideNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = props => {
  const {
    dark,
    showBackground,
    toggleDark,
    toggleBackground,
    isDrawerOpen,
    toggleDrawer,
  } = props
  const { isAuthenticated, logUserOut, loadUser, user } =
    useContext(AuthContext)
  const { getClients, clearClients } = useContext(ClientContext)
  useEffect(() => {
    loadUser()
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    if (user) getClients()
    else {
      clearClients()
      toggleDrawer(false)
    }
    // eslint-disable-next-line
  }, [user])
  return isAuthenticated ? (
    <>
      {isDrawerOpen && (
        <MenuDrawer
          dark={dark}
          toggleDark={toggleDark}
          showBackground={showBackground}
          toggleBackground={toggleBackground}
          toggleDrawer={toggleDrawer}
          logUserOut={logUserOut}
        />
      )}
      <nav className='main-nav'>
        <header>
          <button className='m-3' onClick={toggleDrawer}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className='show-gt-568'>maxWellness</h1>
          <Link to='/'>
            <img
              className='border'
              src='/favicon-32x32.png'
              alt='maxWellness'
            />
          </Link>
        </header>
      </nav>
      <SideNav
        dark={dark}
        toggleDark={toggleDark}
        showBackground={showBackground}
        toggleBackground={toggleBackground}
        toggleDrawer={toggleDrawer}
        logUserOut={logUserOut}
      />
    </>
  ) : null
}

export default Navbar
