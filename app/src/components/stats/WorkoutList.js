import React, { useState } from 'react';
import { alphabetize, getDate } from '../../functions/helpers';
import WorkoutListItem from './WorkoutListItem';

const WorkoutList = ({
  workouts,
  updateWorkouts,
  editWorkout,
  updateRoutine,
}) => {
  const [selected, setSelected] = useState('#');
  const [menuID, setMenuID] = useState(null);
  const toggleMenu = id => (id === menuID ? setMenuID(null) : setMenuID(id));
  const filtered =
    selected !== '#'
      ? workouts.filter(workout => workout.name === selected)
      : workouts;
  const names = alphabetize([
    ...new Set([...workouts.map(workout => workout.name)]),
  ]);
  const handleChange = e => {
    setSelected(e.target.value);
  };
  const EXAMPLE_WORKOUTS = [
    {
      date: getDate(),
      bench: '3(12x135)*',
      deadlift: '3(10x235)',
    },
    {
      date: getDate(-2),
      bench: '3(10x135)',
      deadlift: '3(10x235)*',
    },
    {
      date: getDate(-4),
      bench: '3(10x135)*',
      deadlift: '3(10x225)*',
    },
  ];
  return (
    <>
      {workouts.length ? (
        <>
          <select value={selected} onChange={handleChange}>
            <option key='#' value='#'>
              All Workouts
            </option>
            {names.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className='scrollable'>
            {filtered.map((workout, i) => (
              <WorkoutListItem
                key={i}
                workout={workout}
                selected={selected}
                menuID={menuID}
                toggleMenu={toggleMenu}
                editWorkout={editWorkout}
                updateWorkouts={updateWorkouts}
                updateRoutine={updateRoutine}
              />
            ))}
          </div>
        </>
      ) : (
        <div className='intro-text'>
          <p>
            Your workouts will be displayed here. We recommend giving them names
            which describe the focus of that routine (eg. full body, chest and
            back, legs, etc.) since you'll then be able to filter your workouts
            by name. New personal records will be flagged with an asterisk.
          </p>
          {EXAMPLE_WORKOUTS.map(({ date, bench, deadlift }) => (
            <div className='border-b mb-8 pb-8' key={date}>
              <h3>Chest and Back - {date}</h3>
              <ul>
                <li>
                  <h4>Bench Press: {bench}</h4>
                  <h4>Deadlift: {deadlift}</h4>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WorkoutList;
