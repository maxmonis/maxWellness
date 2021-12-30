import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Roster from '../roster/Roster'
import { Switch } from '../layout/UI'
import WorkoutFilters from './WorkoutFilters'

const SideNav = ({ dark, showBackground, toggleDark, toggleBackground }) => {
  const menuOptions = ['Filters', 'Clients']
  const [selectedMenu, selectMenu] = useState(menuOptions[0])
  return (
    <div className='side-nav show-gt-1200'>
      <header className='mb-16 pb-16 border-b'>
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
          <Roster />
          <Link to='/'>
            <button className='btn-2 mt-24'>My Workouts</button>
          </Link>
        </section>
      )}
    </div>
  )
}

export default SideNav
