import React, { useContext, useEffect } from 'react'
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
    user ? getClients() : clearClients()
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
            />
          )}
          {isAuthenticated && (
            <>
              <button
                className='hover-underline m-12 hide-gt-1200'
                onClick={toggleDrawer}>
                Menu
              </button>
              <button
                className='hover-underline m-12'
                onClick={() => logUserOut()}>
                Logout
              </button>
            </>
          )}
        </header>
      </nav>
    </>
  )
}

export default Navbar
