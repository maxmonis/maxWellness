import React from "react"

export const ActionableAlert = ({ text, btnText, handleClick, classes }) => {
  return (
    <div className={`actionable-alert ${classes || ""}`}>
      <h3>{text}</h3>
      <button onClick={handleClick}>{btnText}</button>
    </div>
  )
}

export const Checkbox = ({ label, bool, toggle }) => (
  <label className="checkbox">
    {label}
    <input type="checkbox" checked={bool} onChange={toggle} />
    <span className="checkmark"></span>
  </label>
)

export const Drawer = ({ children, handleClose }) => (
  <>
    <div className="background-blur-overlay" onClick={handleClose} />
    <div className="drawer">{children}</div>
  </>
)

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
  <div className="input-container">
    <input
      name={name}
      id={label}
      required
      type={type || "text"}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      pattern={type === "number" ? "[0-9]*" : null}
    />
    <label
      htmlFor={label}
      className={persistentLabel ? "persistent-label" : "floating-label"}>
      {label}
    </label>
    {error && <p className="input-error">{error}</p>}
  </div>
)

export const Modal = ({ children, handleClose }) => (
  <>
    <div className="background-blur-overlay" onClick={handleClose} />
    <div className="modal">{children}</div>
  </>
)

export const Spinner = () => <div className="spinner" />

export const Switch = ({ bool, toggle, label }) => (
  <div className="switch-container">
    {label && <label className="switch-label">{label}</label>}
    <label className="switch">
      <input type="checkbox" checked={bool} onChange={toggle} />
      <span className="slider"></span>
    </label>
  </div>
)
