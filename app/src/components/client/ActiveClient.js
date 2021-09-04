import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ActiveClient = ({
  name,
  id,
  toggleDrawer,
  handleEdit,
  handleDeactivate,
}) => {
  const [optionsShown, setOptionsShown] = useState(false);
  const showOptions = () => setOptionsShown(true);
  const hideOptions = () => setOptionsShown(false);
  return (
    <div className='p-8' onMouseEnter={showOptions} onMouseLeave={hideOptions}>
      {optionsShown ? (
        <Link to={id} title='Workouts'>
          <button className='hover-underline mb-0' onClick={toggleDrawer}>
            {name}
          </button>
        </Link>
      ) : (
        <button onClick={toggleDrawer}>{name}</button>
      )}
      {optionsShown && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button className='ml-12 mt-8 red' onClick={handleDeactivate}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default ActiveClient;
