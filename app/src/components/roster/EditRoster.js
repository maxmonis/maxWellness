import React, { useState, useContext } from 'react';
import { Input } from '../layout/UI';
import { strInput, numInput } from '../../functions/helpers';
import ClientContext from '../../context/client/clientContext';

const EditRoster = ({ reset }) => {
  const { addClient, updateClient, editingClient } = useContext(ClientContext);
  const defaultClient = {
    name: '',
    email: '',
    phone: '',
  };
  const initialClient = editingClient ? editingClient : defaultClient;
  const [client, setClient] = useState(initialClient);
  const { name, email, phone } = client;
  const [error, setError] = useState(null);
  const handleChange = e => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (name) {
      editingClient ? updateClient(client) : addClient(client);
      setError(null);
      reset();
    } else {
      setError('Name is required');
    }
  };
  return (
    <div className='client-form'>
      <h3>{editingClient ? 'Edit Client' : 'New Client'}</h3>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label='Name'
          name='name'
          value={strInput(name)}
          handleChange={handleChange}
          error={error}
        />
        <Input
          label='Email'
          name='email'
          value={email}
          handleChange={handleChange}
        />
        <Input
          label='Phone'
          name='phone'
          value={numInput(phone)}
          handleChange={handleChange}
        />
        <div>
          <button onClick={reset}>
            Cancel
          </button>
          <button className='outline mt-0' type='submit'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoster;
