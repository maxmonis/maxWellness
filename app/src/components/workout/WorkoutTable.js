import React from 'react';
import organizeRoutine from '../../functions/organizeRoutine';

const WorkoutTable = ({ workouts }) => {
  const liftNames = new Set();
  for (const { routine } of workouts) {
    for (const { lift } of routine) {
      liftNames.add(lift);
    }
  }
  return (
    <div className='workout-table'>
      {['#', ...Array.from(liftNames)].map(lift => (
        <div>
          <h2 key={lift}>{lift === '#' ? 'Date' : lift}</h2>
          {workouts.map(({ routine, date, name }) => (
            <div className='workout-table-item'>
              {lift === '#' ? (
                <div title={name}>
                  <h3>{date}</h3>
                </div>
              ) : (
                organizeRoutine(routine)
                  .filter(exercise => exercise.lift === lift)
                  .map(exercise => (
                    <div>
                      <h3 key={exercise.id}>{exercise.printout}</h3>
                    </div>
                  ))
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkoutTable;
