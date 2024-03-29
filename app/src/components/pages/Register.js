import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import useValidate from "../../hooks/useValidate"
import validateRegister from "../../validation/validateRegister"
import { Input, Spinner } from "../layout/UI"
import AlertContext from "../../context/alert/alertContext"
import AuthContext from "../../context/auth/authContext"

const Register = ({ history }) => {
  const { setAlert } = useContext(AlertContext)
  const { registerUser, error, clearErrors, isAuthenticated, loading } =
    useContext(AuthContext)
  useEffect(() => {
    if (isAuthenticated) history.push("/")
    if (error === "User already exists") {
      setAlert(error, "critical")
      clearErrors()
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, history])
  const INITIAL_STATE = {
    name: "",
    email: "",
    password: "",
    password2: "",
  }
  const submitForm = () => registerUser({ name, email, password })
  const { values, errors, handleChange, handleSubmit, handleBlur } =
    useValidate(INITIAL_STATE, validateRegister, submitForm)
  const { name, email, password, password2 } = values
  useEffect(() => {
    document.title = `maxWellness | Fitness First`
    // eslint-disable-next-line
  }, [])
  return loading ? (
    <Spinner />
  ) : (
    <div className="page">
      <h1>Welcome!</h1>
      <h4>Create your free account</h4>
      <form noValidate onSubmit={handleSubmit}>
        <Input
          name="name"
          value={name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label="Name"
          error={errors.name}
        />
        <Input
          name="email"
          type="email"
          value={email}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label="Email"
          error={errors.email}
        />
        <Input
          name="password"
          value={password}
          handleBlur={handleBlur}
          handleChange={handleChange}
          type="password"
          label="Password"
          error={errors.password}
        />
        <Input
          name="password2"
          value={password2}
          handleBlur={handleBlur}
          handleChange={handleChange}
          type="password"
          label="Confirm Password"
          error={errors.password2}
        />
        <button className="btn-1 mb-4" type="submit">
          Create Account
        </button>
        <h5>Already a member?</h5>
        <Link to="login">
          <button className="btn-2 mt-1">Sign in</button>
        </Link>
      </form>
    </div>
  )
}

export default Register
