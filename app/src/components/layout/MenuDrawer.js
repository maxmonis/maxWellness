import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Roster from '../roster/Roster';
import { Drawer, Switch } from '../layout/UI';
import WorkoutFilters from './WorkoutFilters';

const MenuDrawer = ({ dark, toggleDark, toggleDrawer }) => {
  const [selectedMenu, selectMenu] = useState('clients');
  return (
    <Drawer handleClose={toggleDrawer}>
      <header className='mb-12 p-0'>
        <button
          onClick={() => selectMenu('clients')}
          className={selectedMenu === 'clients' ? 'underline m-0' : 'm-0'}>
          Clients
        </button>
        <button
          onClick={() => selectMenu('filters')}
          className={selectedMenu === 'filters' ? 'underline m-0' : 'm-0'}>
          Filters
        </button>
      </header>
      {selectedMenu === 'filters' ? (
        <section>
          <WorkoutFilters />
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
  );
};

export default MenuDrawer;
