import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Users as Us } from '../api/users.js';

const Users = ({users}) => {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((u, i) => (<li key={i}>{u.username}</li>))}
      </ul>
    </div>
  );
};


Users.propTypes = {
  users: PropTypes.array
};

export default withTracker(() => {
  return {
    users: Us.find({}).fetch()
  };
})(Users);
