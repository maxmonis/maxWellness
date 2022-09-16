import React from 'react'
import DeleteClient from './DeleteClient'
import useToggle from '../../hooks/useToggle'

const InactiveClient = ({ name, handleActivate, handleDelete }) => {
  const [isMenuOpen, toggleMenu] = useToggle(false)
  const [optionsShown, toggleOptions] = useToggle(false)
  return (
    <>
      {isMenuOpen ? (
        <DeleteClient
          name={name}
          toggleMenu={toggleMenu}
          handleDelete={handleDelete}
        />
      ) : (
        <div
          onMouseEnter={() => toggleOptions(true)}
          onMouseLeave={() => toggleOptions(false)}>
          <button className='line-through cursor-auto' disabled>
            {name}
          </button>
          {optionsShown && (
            <div>
              <button onClick={handleActivate}>Activate</button>
              <button className='red mt-1 ml-5' onClick={toggleMenu}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default InactiveClient
