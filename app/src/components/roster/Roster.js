import React, { useState, useEffect, useContext } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Client from '../client/Client'
import EditRoster from './EditRoster'
import FilterRoster from './FilterRoster'
import { alphabetize } from '../../functions/helpers'
import ClientContext from '../../context/client/clientContext'

const Roster = ({ toggleDrawer }) => {
  const {
    clients,
    editingClient,
    filteredClients,
    clearEditingClient,
    clearFilteredClients,
  } = useContext(ClientContext)
  const active = filteredClients.length
    ? filteredClients.filter(client => client.isActive)
    : clients.filter(client => client.isActive)
  const deactivated = filteredClients.length
    ? filteredClients.filter(client => !client.isActive)
    : clients.filter(client => !client.isActive)
  const sorted = [
    ...alphabetize(active, 'name'),
    ...alphabetize(deactivated, 'name'),
  ].filter(client => client.name[0] !== '#')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const openForm = () => clients.length < 21 && setIsFormOpen(true)
  const reset = () => {
    setIsFormOpen(false)
    clearEditingClient()
    clearFilteredClients()
  }
  useEffect(() => {
    editingClient ? openForm() : reset()
    // eslint-disable-next-line
  }, [editingClient])
  useEffect(() => {
    reset()
    // eslint-disable-next-line
  }, [clients])
  return (
    <>
      {isFormOpen || clients.length < 2 ? (
        <EditRoster reset={reset} />
      ) : (
        <>
          {clients.length > 2 && <FilterRoster />}
          <ul>
            <TransitionGroup>
              {sorted.map(client => (
                <CSSTransition timeout={500} classNames='fade' key={client._id}>
                  <li className='border-b p-12'>
                    <Client client={client} toggleDrawer={toggleDrawer} />
                  </li>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ul>
          {clients.length < 21 && (
            <button className='btn-1 mt-16 mb-12' onClick={openForm}>
              Add New Client
            </button>
          )}
        </>
      )}
      <h4>
        You have {21 - clients.length} opening{clients.length !== 20 && 's'} on
        your roster
      </h4>
    </>
  )
}

export default Roster
