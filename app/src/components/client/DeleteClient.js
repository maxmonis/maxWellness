import React, { useState, useEffect } from 'react';
import { standardize, strInput } from '../../functions/helpers';
import useInputState from '../../hooks/useInputState';

const DeleteClient = ({ name, toggle, handleDelete }) => {
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
      toggle();
      handleDelete();
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h5>Permanently delete {name}?</h5>
      <h6 className='m-12'>
        All associated data will be lost forever and this action cannot be
        undone. Confirm the name of the client you wish to delete in order to
        proceed.
      </h6>
      <input
        value={strInput(value)}
        placeholder='Confirm Name...'
        onChange={handleChange}
      />
      <div className='m-8'>
        <button onClick={toggle}>Cancel</button>
        {isMatch ? (
          <button className='red' type='submit'>
            Delete
          </button>
        ) : (
          <button disabled>Delete</button>
        )}
      </div>
    </form>
  );
};

export default DeleteClient;
