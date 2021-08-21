import React from 'react';

export const Drawer = ({ children, handleClose }) => {
  return (
    <>
      <div className='background-blur-overlay' onClick={handleClose} />
      <div className='drawer'>{children}</div>
    </>
  );
};

export const Input = ({
  name,
  value,
  type,
  handleBlur,
  handleChange,
  label,
  error,
  persistentLabel,
}) => (
  <div className='input-container'>
    <input
      name={name}
      id={label}
      required
      type={type || 'text'}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      pattern={type === 'number' ? '[0-9]*' : null}
    />
    <label htmlFor={label} className={persistentLabel ? 'persistent-label' : 'floating-label'}>
      {label}
    </label>
    {error && <p className='input-error'>{error}</p>}
  </div>
);

export const Modal = ({ children, handleClose }) => {
  return (
    <>
      <div className='background-blur-overlay' onClick={handleClose} />
      <div className='modal'>{children}</div>
    </>
  );
};

export const Spinner = () => <div className='spinner' />;

export const Switch = ({ bool, toggle, label }) => (
  <div className='switch-container'>
    {label && <label className='switch-label'>{label}</label>}
    <label className='switch'>
      <input type='checkbox' checked={bool} onChange={toggle} />
      <span className='slider'></span>
    </label>
  </div>
);
