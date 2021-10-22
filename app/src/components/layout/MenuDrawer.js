import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Roster from '../roster/Roster'
import { Drawer, Switch } from '../layout/UI'
import WorkoutFilters from './WorkoutFilters'

const MenuDrawer = ({ dark, showBackground, toggleDark, toggleBackground, toggleDrawer }) => {
  const [selectedMenu, selectMenu] = useState('clients')
  return (
    <Drawer handleClose={toggleDrawer}>
      <header className='mb-12 p-0'>
        <button
          onClick={() => selectMenu('clients')}
          className={selectedMenu === 'clients' ? 'underline' : ''}>
          Clients
        </button>
        <button
          onClick={() => selectMenu('filters')}
          className={selectedMenu === 'filters' ? 'underline' : ''}>
          Filters
        </button>
      </header>
      {selectedMenu === 'filters' ? (
        <section>
          <WorkoutFilters />
          <Switch label='Dark Mode' bool={dark} toggle={toggleDark} />
          <Switch label='Background Image' bool={showBackground} toggle={toggleBackground} />
        </section>
      ) : (
        <section>
          <Roster toggleDrawer={toggleDrawer} />
          <Link to='/'>
            <button className='btn-2 mt-24' onClick={toggleDrawer}>
              My Workouts
            </button>
          </Link>
        </section>
      )}
    </Drawer>
  )
}

export default MenuDrawer
