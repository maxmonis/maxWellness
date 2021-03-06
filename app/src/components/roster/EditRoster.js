import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
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
  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingClient) {
      addClient(client);
    } else {
      updateClient(client);
    }
    reset();
  };
  return (
    <div>
      <Typography variant='h6'>
        {editingClient ? 'Edit Client' : 'New Client'}
      </Typography>
      <form className='form' onSubmit={handleSubmit}>
        <TextField
          type='text'
          placeholder='Name'
          name='name'
          value={strInput(name)}
          onChange={handleChange}
          autoFocus
          required
        />
        <TextField
          type='text'
          placeholder='Email'
          name='email'
          value={email}
          onChange={handleChange}
        />
        <TextField
          type='text'
          placeholder='Phone'
          name='phone'
          value={phone}
          onChange={handleChange}
        />
        <div>
          <Button onClick={reset}>Cancel</Button>
          <Button color='primary' type='submit'>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRoster;
