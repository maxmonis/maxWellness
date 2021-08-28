import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Roster from '../roster/Roster';
import { Checkbox, Drawer, Spinner, Switch } from '../layout/UI';
import WorkoutContext from '../../context/workout/workoutContext';
import { formatDate } from '../../functions/helpers';

const MenuDrawer = ({ dark, toggleDark, toggleDrawer }) => {
  const { workoutsFilters, updateWorkoutsFilter, clearWorkoutsFilters } =
    useContext(WorkoutContext);
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
          {workoutsFilters ? (
            <>
              <h3 className='m-12'>Workout Name</h3>
              {workoutsFilters.workoutNames.map(({ name, checked }) => (
                <Checkbox
                  key={name}
                  label={name}
                  bool={checked}
                  toggle={() =>
                    updateWorkoutsFilter({ type: 'workoutName', clicked: name })
                  }
                />
              ))}
              <h3 className='m-12'>Exercise Name</h3>
              {workoutsFilters.liftNames.map(({ name, checked }) => (
                <Checkbox
                  key={name}
                  label={name}
                  bool={checked}
                  toggle={() =>
                    updateWorkoutsFilter({ type: 'liftName', clicked: name })
                  }
                />
              ))}
              <h3 className='m-12'>Workout Date</h3>
              <select
                value={workoutsFilters.workoutDates.startDate}
                onChange={e =>
                  updateWorkoutsFilter({
                    type: 'startDate',
                    clicked: e.target.value,
                  })
                }>
                {workoutsFilters.workoutDates.allDates
                  .filter(date => date < workoutsFilters.workoutDates.endDate)
                  .map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
              </select>
              <h5 className='m-4'>to</h5>
              <select
                value={workoutsFilters.workoutDates.endDate}
                onChange={e =>
                  updateWorkoutsFilter({
                    type: 'endDate',
                    clicked: e.target.value,
                  })
                }>
                {workoutsFilters.workoutDates.allDates
                  .filter(date => date > workoutsFilters.workoutDates.startDate)
                  .map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
              </select>
              <button
                className='btn-two mt-24 mb-48'
                onClick={clearWorkoutsFilters}>
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <Spinner />
              <h3>Loading filters...</h3>
            </>
          )}
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
