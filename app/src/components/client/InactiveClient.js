import React, { useState } from 'react';
import DeleteClient from './DeleteClient';
import useToggle from '../../hooks/useToggle';

const InactiveClient = ({ name, handleActivate, handleDelete }) => {
  const [isMenuOpen, toggleMenu] = useToggle(false);
  const [optionsShown, setOptionsShown] = useState(false);
  const showOptions = () => setOptionsShown(true);
  const hideOptions = () => setOptionsShown(false);
  return (
    <>
      {isMenuOpen ? (
        <DeleteClient name={name} toggleMenu={toggleMenu} handleDelete={handleDelete} />
      ) : (
        <div onMouseEnter={showOptions} onMouseLeave={hideOptions}>
          <button disabled>{name}</button>
          {optionsShown && (
            <div>
              <button className='blue' onClick={handleActivate}>
                Reactivate
              </button>
              <button className='red' onClick={toggleMenu}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InactiveClient;
