import React, { useContext } from 'react';
import { formatDate } from '../../functions/helpers';
import { Checkbox } from './UI';
import WorkoutContext from '../../context/workout/workoutContext';

const WorkoutFilters = () => {
  const { workoutsFilters, updateWorkoutsFilter, clearWorkoutsFilters } =
    useContext(WorkoutContext);
  return workoutsFilters.workoutNames.length ? (
    <>
      <h3 className='m-8'>Workout Name</h3>
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
      <h3 className='m-8'>Exercise Name</h3>
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
      <h3 className='m-8'>Workout Date</h3>
      <Checkbox
        label='Show newest first'
        bool={workoutsFilters.newestFirst}
        toggle={() => updateWorkoutsFilter({ type: 'chronology' })}
      />
      <select
        className='mt-8'
        value={workoutsFilters.workoutDates.startDate}
        onChange={e =>
          updateWorkoutsFilter({
            type: 'startDate',
            clicked: e.target.value,
          })
        }>
        {workoutsFilters.workoutDates.allDates
          .filter(date => date <= workoutsFilters.workoutDates.endDate)
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
          .filter(date => date >= workoutsFilters.workoutDates.startDate)
          .map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
      </select>
      <button className='btn-two mt-24 mb-48' onClick={clearWorkoutsFilters}>
        Clear Filters
      </button>
    </>
  ) : (
    <h4 className='mt-24 mb-24'>
      Workout filters will be displayed here. You'll be able to filter by
      workout name, workout date, or exercise name.
    </h4>
  );
};

export default WorkoutFilters;
