import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import '../styles/Profile.css';
import Explore from './Explore';
import Dashboard from './Dashboard';

const Profile = ({ user, createDoc, showDocument, status, logout }) => {

  const [state, setState] = useState(status);

  const renders = {
    0: <Explore showDocument={showDocument}/>,
    1: <Dashboard createDoc={createDoc} showDocument={showDocument}/>,
    2: undefined
  };

  return (
    <div id="profile">
      <div>
        <div>
          <span>{user && user.username}</span>
        </div>
        <div>
          <button className={state === 0 ? 'active' : ''} onClick={() => setState(0)}>Explore</button>
          <button className={state === 1 ? 'active' : ''} onClick={() => setState(1)}>Dashboard</button>
          <button className={state === 2 ? 'active' : ''} onClick={() => setState(2)}>Settings</button>
        </div>
        <div>
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
      <div>
        {renders[state]}
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  createDoc: PropTypes.func.isRequired,
  showDocument: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  status: PropTypes.number
};

export default withTracker((props) => {
  return {
    user: Meteor.user(),
    ...props
  };
})(Profile);