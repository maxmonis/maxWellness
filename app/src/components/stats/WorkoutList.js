import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { alphabetize } from '../../functions/helpers';
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
          <TransitionGroup className='scrollable'>
            {filtered.map(workout => (
              <CSSTransition key={workout.id} timeout={500} classNames='fade'>
                <WorkoutListItem
                  workout={workout}
                  selected={selected}
                  menuID={menuID}
                  toggleMenu={toggleMenu}
                  editWorkout={editWorkout}
                  updateWorkouts={updateWorkouts}
                  updateRoutine={updateRoutine}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </>
      ) : (
        <p className='intro-text'>
          Your workouts will be displayed here. We recommend giving them names
          which describe the focus of that routine (eg. full body, chest and
          back, legs, etc.) since you'll then be able to filter your workouts by
          name. New personal records will be flagged with an asterisk.
        </p>
      )}
    </>
  );
};

export default WorkoutList;
