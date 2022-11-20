import React, { useReducer } from "react"
import ClientContext from "./clientContext"
import clientReducer from "./clientReducer"
import request from "../../functions/request"
import { standardize } from "../../functions/helpers"

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
      const payload = await request("/api/clients")
      if (payload.length === 0) addClient({ name: "#" })
      dispatch({ type: "GET_CLIENTS", payload })
    } catch ({ message }) {
      dispatch({ type: "CLIENT_ERROR", payload: message })
    }
  }
  const addClient = async body => {
    const { name } = body
    if (nameIsUnique({ name })) {
      try {
        const payload = await request("/api/clients", { body })
        dispatch({ type: "ADD_CLIENT", payload })
      } catch ({ message }) {
        dispatch({ type: "CLIENT_ERROR", payload: message })
      }
    } else {
      dispatch({ type: "CLIENT_ERROR", payload: `${name} already exists` })
    }
  }
  const updateClient = async body => {
    const { name, _id } = body
    if (nameIsUnique({ name, _id })) {
      try {
        const config = { body, method: "PUT" }
        const payload = await request(`/api/clients/${_id}`, config)
        dispatch({ type: "UPDATE_CLIENT", payload })
      } catch ({ message }) {
        dispatch({ type: "CLIENT_ERROR", payload: message })
      }
    } else {
      dispatch({ type: "CLIENT_ERROR", payload: `${name} already exists` })
    }
  }
  const deleteClient = async id => {
    try {
      await request(`/api/clients/${id}`, { method: "DELETE" })
      dispatch({ type: "DELETE_CLIENT", payload: id })
    } catch ({ message }) {
      dispatch({ type: "CLIENT_ERROR", payload: message })
    }
  }
  const clearClients = () => {
    dispatch({ type: "CLEAR_CLIENTS" })
  }
  const setEditingClient = payload => {
    dispatch({ type: "SET_EDITING_CLIENT", payload })
  }
  const clearEditingClient = () => {
    dispatch({ type: "CLEAR_EDITING_CLIENT" })
  }
  const filterClients = payload => {
    dispatch({ type: "FILTER_CLIENTS", payload })
  }
  const clearFilteredClients = () => {
    dispatch({ type: "CLEAR_FILTERED_CLIENTS" })
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
  function nameIsUnique({ name, _id }) {
    return !clients.some(
      client =>
        standardize(client.name) === standardize(name) && client._id !== _id,
    )
  }
}

export default ClientState
