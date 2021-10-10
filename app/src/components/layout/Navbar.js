import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/authContext'
import ClientContext from '../../context/client/clientContext'
import MenuDrawer from './MenuDrawer'

const Navbar = props => {
  const { dark, toggleDark, isDrawerOpen, toggleDrawer } = props
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
    <nav>
      <header>
        {isDrawerOpen && (
          <MenuDrawer
            dark={dark}
            toggleDark={toggleDark}
            toggleDrawer={toggleDrawer}
          />
        )}
        {isAuthenticated && (
          <>
            <button className='hover-underline m-12' onClick={toggleDrawer}>
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
  )
}

export default Navbar
