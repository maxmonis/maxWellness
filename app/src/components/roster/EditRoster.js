import React, { useState, useContext } from 'react';
import { Input } from '../layout/UI';
import { strInput } from '../../functions/helpers';
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
    <div>
      <h4>{editingClient ? 'Edit Client' : 'New Client'}</h4>
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
          value={phone}
          handleChange={handleChange}
        />
        <div>
          <button className='blue' onClick={reset}>
            Cancel
          </button>
          <button className='blue' type='submit'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoster;
