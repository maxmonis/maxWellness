import React, { useContext } from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import useToggle from '../../hooks/useToggle';
import AlertContext from '../../context/alert/alertContext';
import { formatDate } from '../../functions/helpers';
import { Modal } from '../layout/UI';

const WorkoutListItem = ({
  workout,
  selected,
  selectWorkout,
  updateRoutine,
  updateWorkouts,
  menuID,
  toggleMenu,
}) => {
  const { setAlert } = useContext(AlertContext);
  const { id, date, name, routine } = workout;
  const [showDeleteModal, toggleDeleteModal] = useToggle(false);
  const handleDelete = () => {
    updateWorkouts(id);
    setAlert('Workout Deleted', 'success');
  };
  const HOVER_TEXT =
    'Click to copy routine, double click to copy workout to clipboard';
  const organizedRoutine = organizeRoutine(routine);
  const CLIPBOARD_TEXT = `
  ${name}
  ${formatDate(date)}
  ${organizedRoutine.map(exercise => `${exercise.lift}: ${exercise.printout}`)}
  `;
  return (
    <>
      {showDeleteModal && (
        <Modal handleClose={toggleDeleteModal}>
          <h2>Delete Workout?</h2>
          <h5 className='mt-8 mb-24'>This action cannot be undone</h5>
          <button className='red' onClick={handleDelete}>
            Delete
          </button>
          <button onClick={toggleDeleteModal}>Cancel</button>
        </Modal>
      )}
      <h3
        className='pointer'
        onClick={() => toggleMenu(workout.id)}
        title='Click to open menu'>
        {selected === '#' && `${name} - `}
        {formatDate(date)}
      </h3>
      <section className='mb-24'>
        <ul>
          {organizedRoutine.map(exercise => (
            <li
              className='pointer'
              key={exercise.id}
              onClick={() => updateRoutine(routine)}
              onDoubleClick={() =>
                navigator.clipboard.writeText(CLIPBOARD_TEXT)
              }
              title={HOVER_TEXT}>
              <h4>{`${exercise.lift}: ${exercise.printout}`}</h4>
            </li>
          ))}
        </ul>
        {menuID === workout.id && (
          <>
            <button className='blue' onClick={() => selectWorkout(workout)}>
              Edit
            </button>
            <button className='red' onClick={toggleDeleteModal}>
              Delete
            </button>
          </>
        )}
      </section>
    </>
  );
};

export default WorkoutListItem;
