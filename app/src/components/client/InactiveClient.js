import React, { useState } from 'react';
import DeleteClient from './DeleteClient';
import useToggle from '../../hooks/useToggle';

const InactiveClient = ({ name, handleActivate, handleDelete }) => {
  const [isMenuOpen, toggle] = useToggle(false);
  const [optionsShown, setOptionsShown] = useState(false);
  const showOptions = () => setOptionsShown(true);
  const hideOptions = () => setOptionsShown(false);
  return (
    <div onMouseEnter={showOptions} onMouseLeave={hideOptions}>
      <button disabled>{name}</button>
      {optionsShown && (
        <div>
          <button className='blue' onClick={handleActivate}>
            Reactivate
          </button>
          <button className='red' onClick={toggle}>
            Delete
          </button>
        </div>
      )}
      {isMenuOpen && (
        <DeleteClient name={name} toggle={toggle} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default InactiveClient;
