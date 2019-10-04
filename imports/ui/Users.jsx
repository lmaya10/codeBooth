import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
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
  Meteor.subscribe('users');

  return {
    users: Us.find({}).fetch()
  };
})(Users);
