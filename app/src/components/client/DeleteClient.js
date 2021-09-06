import React, { useState, useEffect, useContext } from 'react';
import { standardize, strInput } from '../../functions/helpers';
import useInputState from '../../hooks/useInputState';
import AlertContext from '../../context/alert/alertContext';

const DeleteClient = ({ name, toggleMenu, handleDelete }) => {
  const { setAlert } = useContext(AlertContext);
  const [value, handleChange] = useInputState('');
  const [isMatch, setIsMatch] = useState(false);
  useEffect(() => {
    standardize(value).includes(standardize(name))
      ? setIsMatch(true)
      : setIsMatch(false);
    // eslint-disable-next-line
  }, [value]);
  const handleSubmit = e => {
    e.preventDefault();
    if (isMatch) {
      toggleMenu();
      handleDelete();
      setAlert('Client Deleted', 'success');
    }
  };
  return (
    <form className='pb-12' onSubmit={handleSubmit}>
      <h4 className='mt-12 mb-12'>Permanently delete {name}?</h4>
      <h5>
        All associated data will be lost forever and this action cannot be
        undone. Confirm the name of the client you wish to delete in order to
        proceed.
      </h5>
      <input
        className='m-12'
        value={strInput(value)}
        placeholder='Confirm Name...'
        onChange={handleChange}
      />
      <div>
        <button onClick={toggleMenu} type='button'>
          Cancel
        </button>
        <button className='red ml-20' type='submit' disabled={!isMatch}>
          Delete
        </button>
      </div>
    </form>
  );
};

export default DeleteClient;
