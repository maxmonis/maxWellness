import React, { useContext } from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import useToggle from '../../hooks/useToggle';
import AlertContext from '../../context/alert/alertContext';
import { formatDate } from '../../functions/helpers';
import { Modal } from '../layout/UI';

const WorkoutListItem = ({
  workout,
  selected,
  editWorkout,
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
  const organizedRoutine = organizeRoutine(routine);
  const CLIPBOARD_TEXT = `
  ${name}
  ${formatDate(date)}
  ${organizedRoutine.map(exercise => `${exercise.lift}: ${exercise.printout}`)}
  `;
  const handleClick = () => {
    updateRoutine(routine);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CLIPBOARD_TEXT);
    }
  };
  return (
    <div
      className='border-b mb-8 pb-4'
      onMouseEnter={() => toggleMenu(workout.id)}
      onMouseLeave={() => toggleMenu(workout.id)}>
      {showDeleteModal && (
        <Modal handleClose={toggleDeleteModal}>
          <h2>Delete Workout?</h2>
          <h5 className='mt-8 mb-24'>This action cannot be undone</h5>
          <button onClick={toggleDeleteModal}>Cancel</button>
          <button className='red' onClick={handleDelete}>
            Delete
          </button>
        </Modal>
      )}
      <h3 className='pointer' onClick={handleClick} title='Copy'>
        {selected === '#' && `${name} - `}
        {formatDate(date)}
      </h3>
      <section className='mb-4'>
        <ul>
          {organizedRoutine.map(exercise => (
            <li key={exercise.id}>
              <h4>{`${exercise.lift}: ${exercise.printout}`}</h4>
            </li>
          ))}
        </ul>
        {menuID === workout.id && (
          <>
            <button className='outline' onClick={() => editWorkout(workout)}>
              Edit
            </button>
            <button className='red' onClick={toggleDeleteModal}>
              Delete
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default WorkoutListItem;
