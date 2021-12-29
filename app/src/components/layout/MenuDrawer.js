import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Roster from '../roster/Roster'
import { Drawer, Switch } from '../layout/UI'
import WorkoutFilters from './WorkoutFilters'

const MenuDrawer = ({
  dark,
  showBackground,
  toggleDark,
  toggleBackground,
  toggleDrawer,
}) => {
  const menuOptions = ['Filters', 'Clients']
  const [selectedMenu, selectMenu] = useState(menuOptions[0])
  return (
    <Drawer handleClose={toggleDrawer}>
      <header className='mb-16 p-0 pb-16 border-b'>
        {menuOptions.map(option => (
          <button
            key={option}
            onClick={() => selectMenu(option)}
            className={selectedMenu === option ? 'underline' : ''}>
            {option}
          </button>
        ))}
      </header>
      {selectedMenu === menuOptions[0] ? (
        <section>
          <WorkoutFilters />
          <Switch label='Dark Mode' bool={dark} toggle={toggleDark} />
          <Switch
            label='Background Image'
            bool={showBackground}
            toggle={toggleBackground}
          />
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
