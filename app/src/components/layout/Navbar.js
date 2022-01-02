import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/auth/authContext'
import ClientContext from '../../context/client/clientContext'
import MenuDrawer from './MenuDrawer'
import SideNav from './SideNav'

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
  return (
    <>
      {isAuthenticated && (
        <SideNav
          dark={dark}
          toggleDark={toggleDark}
          showBackground={showBackground}
          toggleBackground={toggleBackground}
          toggleDrawer={toggleDrawer}
          logUserOut={logUserOut}
        />
      )}
      <nav>
        <header>
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
          {isAuthenticated && (
            <>
              <button
                className='hover-underline m-12'
                onClick={toggleDrawer}>
                Menu
              </button>
              <Link to='/'>
                <img
                  className='m-8 border'
                  src='/favicon-32x32.png'
                  alt='maxWellness'
                />
              </Link>
            </>
          )}
        </header>
      </nav>
    </>
  )
}

export default Navbar
