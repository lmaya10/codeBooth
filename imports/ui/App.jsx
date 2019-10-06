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
  const [toast, setToast] = useState(undefined);
  const [document, setDocument] = useState(undefined);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(undefined), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

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

  useEffect(() => {
    if (document) {
      setState(3);
    }
  }, [document]);

  const showDocument = (d) => {
    setDocument(d);
  };

  const showToast = (to) => setToast(to);

  const renders = {
    0: <Loader />,
    1: <Auth changeState={setState} showToast={showToast} />,
    2: <Profile changeState={setState} showDocument={showDocument} />,
    3: <Editor showToast={showToast} documentId={document ? document._id : undefined} />
  };

  return (
    <div>
      <div id="header" className={state === 3 ? 'no-shadow' : ''}>
        <h1>Code Booth</h1>
      </div>
      <div id="content">
        {renders[state]}
      </div>
      <div id="toast" className={toast ? toast.state : ''}>{toast ? toast.msg : ''}</div>
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
