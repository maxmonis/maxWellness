import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import OptionListItem from './OptionListItem'
import AddOption from './AddOption'

const UpdateOptions = ({
  options,
  updateOptions,
  toggleOptionForm,
  optionName,
}) => {
  return (
    <div className='update-options'>
      <h2>{optionName}s</h2>
      <AddOption updateOptions={updateOptions} optionName={optionName} />
      <ul>
        <TransitionGroup>
          {options.map(option => (
            <CSSTransition key={option} timeout={500} classNames='fade'>
              <OptionListItem option={option} updateOptions={updateOptions} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
      <button className='btn-2 mt-24' onClick={toggleOptionForm}>
        Done Editing
      </button>
    </div>
  )
}

export default UpdateOptions
