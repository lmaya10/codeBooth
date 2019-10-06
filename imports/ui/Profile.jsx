import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import '../styles/Profile.css';
import Explore from './Explore';
import Dashboard from './Dashboard';

const Profile = ({ user, changeState, showDocument }) => {

  const [state, setState] = useState(1);

  const renders = {
    0: <Explore showDocument={showDocument}/>,
    1: <Dashboard changeState={changeState} showDocument={showDocument}/>,
    2: undefined
  };

  return (
    <div id="profile">
      <div>
        <div>
          <span>{user.username}</span>
        </div>
        <div>
          <button className={state === 0 ? 'active' : ''} onClick={() => setState(0)}>Explore</button>
          <button className={state === 1 ? 'active' : ''} onClick={() => setState(1)}>My Dashboard</button>
          <button className={state === 2 ? 'active' : ''} onClick={() => setState(2)}>Settings</button>
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
  changeState: PropTypes.func.isRequired,
  showDocument: PropTypes.func.isRequired
};

export default withTracker((props) => {
  return {
    user: Meteor.user(),
    ...props
  };
})(Profile);