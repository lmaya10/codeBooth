import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Auth from './Auth';
import '../styles/App.css';
import Profile from './Profile';
import Editor from './Editor';
import Loader from './Loader';

const App = ({ user }) => {

  const [state, setState] = useState(0);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(undefined), 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    if (state !== 3) {
      if (user === null && state === 0) {
        setState(1);
      }
      else if (user) {
        setState(2);
      }
    }
  }, [user, state]);

  const showError = (msg) => setError(msg);

  const renders = {
    0: <Loader />,
    1: <Auth changeState={setState} showError={showError} />,
    2: <Profile changeState={setState} />,
    3: <Editor />
  };

  return (
    <div>
      <div id="header" className={state === 3 ? 'no-shadow' : ''}>
        <h1>Code Booth</h1>
      </div>
      <div id="content">
        {renders[state]}
      </div>
      <div id="error" className={error ? '' : 'hidden'}>{error}</div>
    </div>
  );
};

App.propTypes = {
  user: PropTypes.object
};

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(App);
