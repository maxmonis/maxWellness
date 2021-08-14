import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ActiveClient = ({ name, id, toggleDrawer, handleEdit, handleDeactivate }) => {
  const [optionsShown, setOptionsShown] = useState(false);
  const showOptions = () => setOptionsShown(true);
  const hideOptions = () => setOptionsShown(false);
  return (
    <div onMouseEnter={showOptions} onMouseLeave={hideOptions}>
      {optionsShown ? (
        <Link className='link' to={id}>
          <button onClick={toggleDrawer}>{name}</button>
        </Link>
      ) : (
        <button onClick={toggleDrawer}>{name}</button>
      )}
      {optionsShown && (
        <div>
          <button className='blue' onClick={handleEdit}>
            Edit
          </button>
          <button className='red' onClick={handleDeactivate}>
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveClient;
