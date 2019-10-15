import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Auth from './Auth';
import '../styles/App.css';
import Profile from './Profile';
import Editor from './Editor';
import Loader from './Loader';
import { call } from '../utils/mongo';

const App = ({ user }) => {

   /*
   Cuando se maneja solo por tab deberia iluminarse las cosas para saber uno donde esta parado porque no es claro y no se sabe a que se esta intentando acceder
   */ 
  const [state, setState] = useState(0);
  const [profileState, setProfileState] = useState(1);
  const [toast, setToast] = useState(undefined);
  const [document, setDocument] = useState(undefined);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(undefined), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  useEffect(() => {
    const logged = !!Meteor.userId();

    if (state !== 3) {
      if (!logged && state === 0) {
        setState(1);
      }
      else if (logged) {
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

  const goMenu = (i) => {
    setState(2);
    setProfileState(i);
    setShowMenu(false);
  };

  const createDoc = () => {
    setDocument(undefined);
    setState(3);
  };

  const logOut = () => {
    Meteor.logout(() => {
      setState(0);
    });
  };

  const saveShare = (docId, shares) => {
    (async () => {
      await call('document.setShares', docId, shares);
    })();
  };

  const renders = {
    0: <Loader />,
    1: <Auth changeState={setState} showToast={showToast} />,
    2: <Profile createDoc={createDoc} showDocument={showDocument} status={profileState} logout={logOut} />,
    3: <Editor showToast={showToast} documentId={document ? document._id : undefined} showDocument={showDocument} saveShare={saveShare} />
  };

  return (
    <div>
      <div id="header" className={state === 3 ? 'no-shadow' : ''}>
        <h1>Code Booth</h1>
        <div id="right-menu" className={state === 3 ? '' : 'hidden'}>
          <button aria-label="menu" onClick={() => setShowMenu(s => !s)}>
            <i className="fas fa-user-circle"></i>
          </button>
          <div className={showMenu ? '' : 'hidden'}>
            <button aria-label="explore" onClick={() => goMenu(0)}>Explore</button>
            <button aria-label="dashboard" onClick={() => goMenu(1)}>Dashboard</button>
            <button aria-label="settings" onClick={() => goMenu(2)}>Settings</button>
            <button aria-label="log out" onClick={logOut}>Log Out</button>
          </div>
        </div>
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
