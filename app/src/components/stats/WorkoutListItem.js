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
      <h3 className='pointer' onClick={() => toggleMenu(workout.id)}>
        {selected === '#' && `${name} - `}
        {formatDate(date)}
      </h3>
      <section className='mb-24'>
        <ul>
          {organizeRoutine(routine).map(exercise => (
            <li key={exercise.id}>
              <h4>{`${exercise.lift}: ${exercise.printout}`}</h4>
            </li>
          ))}
        </ul>
        {menuID === workout.id && (
          <>
            <button className='blue' onClick={() => selectWorkout(workout)}>Edit</button>
            <button className='blue' onClick={toggleDeleteModal}>Delete</button>
          </>
        )}
      </section>
    </>
  );
};

export default WorkoutListItem;
