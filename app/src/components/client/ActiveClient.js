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
    <div onMouseEnter={showOptions} onMouseLeave={hideOptions}>
      {optionsShown ? (
        <Link to={id} title='Workouts'>
          <button className='hover-underline' onClick={toggleDrawer}>
            {name}
          </button>
        </Link>
      ) : (
        <button onClick={toggleDrawer}>{name}</button>
      )}
      {optionsShown && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button className='red mt-4 ml-20' onClick={handleDeactivate}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default ActiveClient;
