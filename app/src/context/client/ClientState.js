import React, { useReducer } from 'react'
import ClientContext from './clientContext'
import clientReducer from './clientReducer'
import request from '../../functions/request'
import { standardize } from '../../functions/helpers'

const ClientState = props => {
  const initialState = {
    clients: [],
    editingClient: null,
    filteredClients: [],
    loading: true,
    error: null,
  }
  const [state, dispatch] = useReducer(clientReducer, initialState)
  const { clients, editingClient, filteredClients, loading, error } = state
  const getClients = async () => {
    try {
      const payload = await request('/api/clients')
      if (payload.length === 0) addClient({ name: '#' })
      dispatch({ type: 'GET_CLIENTS', payload })
    } catch (err) {
      dispatch({ type: 'CLIENT_ERROR', payload: 'Error' })
    }
  }
  const addClient = async body => {
    const { name } = body
    if (nameIsDuplicate({ name })) {
      dispatch({ type: 'CLIENT_ERROR', payload: `${name} already exists` })
    } else {
      try {
        const payload = await request('/api/clients', { body })
        dispatch({ type: 'ADD_CLIENT', payload })
      } catch (err) {
        dispatch({ type: 'CLIENT_ERROR', payload: 'Error' })
      }
    }
  }
  const updateClient = async body => {
    const { name, _id } = body
    if (nameIsDuplicate({ name, _id })) {
      dispatch({ type: 'CLIENT_ERROR', payload: `${name} already exists` })
    } else {
      try {
        const config = { body, method: 'PUT' }
        const payload = await request(`/api/clients/${_id}`, config)
        dispatch({ type: 'UPDATE_CLIENT', payload })
      } catch (err) {
        dispatch({ type: 'CLIENT_ERROR', payload: 'Error' })
      }
    }
  }
  const deleteClient = async id => {
    try {
      await request(`/api/clients/${id}`, { method: 'DELETE' })
      dispatch({ type: 'DELETE_CLIENT', payload: id })
    } catch (err) {
      dispatch({ type: 'CLIENT_ERROR', payload: 'Error' })
    }
  }
  const clearClients = () => {
    dispatch({ type: 'CLEAR_CLIENTS' })
  }
  const setEditingClient = client => {
    dispatch({ type: 'SET_EDITING_CLIENT', payload: client })
  }
  const clearEditingClient = () => {
    dispatch({ type: 'CLEAR_EDITING_CLIENT' })
  }
  const filterClients = text => {
    dispatch({ type: 'FILTER_CLIENTS', payload: text })
  }
  const clearFilteredClients = () => {
    dispatch({ type: 'CLEAR_FILTERED_CLIENTS' })
  }
  return (
    <ClientContext.Provider
      value={{
        clients,
        editingClient,
        filteredClients,
        loading,
        error,
        getClients,
        addClient,
        deleteClient,
        updateClient,
        clearClients,
        setEditingClient,
        clearEditingClient,
        filterClients,
        clearFilteredClients,
      }}>
      {props.children}
    </ClientContext.Provider>
  )
  function nameIsDuplicate({ name, _id }) {
    return clients.some(
      client =>
        standardize(client.name) === standardize(name) && client._id !== _id
    )
  }
}

export default ClientState
