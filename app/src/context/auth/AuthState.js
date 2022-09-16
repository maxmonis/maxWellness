import React, { useReducer } from 'react'
import AuthContext from './authContext'
import authReducer from './authReducer'
import request from '../../functions/request'

const AuthState = ({ children }) => {
  const INITIAL_STATE = {
    token: localStorage.getItem('maxWellness_token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  }
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)
  const { token, isAuthenticated, loading, user, error } = state
  const loadUser = async () => {
    try {
      const payload = await request('/api/auth')
      dispatch({ type: 'USER_LOADED', payload })
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' })
    }
  }
  const registerUser = async body => {
    try {
      const payload = await request('/api/users', { body })
      dispatch({ type: 'REGISTER_SUCCESS', payload })
      loadUser()
    } catch ({ message }) {
      dispatch({ type: 'REGISTER_FAILURE', payload: message })
    }
  }
  const logUserIn = async body => {
    try {
      const payload = await request('/api/auth', { body })
      dispatch({ type: 'LOGIN_SUCCESS', payload })
      loadUser()
    } catch ({ message }) {
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
    }
  }
  const logUserOut = () => {
    dispatch({ type: 'LOG_USER_OUT' })
  }
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' })
  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        loadUser,
        registerUser,
        logUserIn,
        logUserOut,
        clearErrors,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthState
