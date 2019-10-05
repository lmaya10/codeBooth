import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../styles/Auth.css';

const Auth = ({ changeState, showError }) => {

  const [state, setState] = useState(0);
  let _user = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  const login = () => {
    if (!_user.username || !_user.password) {
      showError('Please provide all the fields');
    }
    else {
      Meteor.loginWithPassword(_user.username, _user.password, (err) => {
        if (err) {
          showError(err.message);
        }
        else {
          changeState(2);
        }
      });
    }
  };

  const signup = () => {
    _user.username = _user.username.replace(/\W/g, '');
    if (!_user.username || !_user.password || !_user.confirmPassword) {
      showError('Please provide all the fields');
    }
    else {
      if (_user.password !== _user.confirmPassword) {
        showError('Password does not match');
      }
      else {
        Accounts.createUser({
          username: _user.username,
          password: _user.password
        }, err => {
          if (err) {
            showError(err.message);
          }
          else {
            changeState(2);
          }
        });
      }
    }
  };

  const inputChange = (key) => {
    return (e) => (_user[key] = e.target.value);
  };

  const renders = [
    (
      <div key="1">
        <input type="text" placeholder="Username" onChange={inputChange('username')} />
        <input type="password" placeholder="Password" onChange={inputChange('password')} />
        <div>
          <button onClick={login}>Log In</button>
        </div>
      </div>
    ),
    (
      <div key="2">
        <input type="text" placeholder="Username" onChange={inputChange('username')} />
        <input type="password" placeholder="Password" onChange={inputChange('password')} />
        <input type="password" placeholder="Confirm Password" onChange={inputChange('confirmPassword')} />
        <div>
          <button onClick={signup}>Sign Up</button>
        </div>
      </div>
    )
  ];

  return (
    <>
      <div id="auth">
        <div>
          <div>
            <h3>Start sharing code in real time</h3>
            <span>{state === 0 ? 'You\'re one of ours' : 'Join the dark forces'}</span>
          </div>
          <div>
            <button className={state === 0 ? 'active' : ''} onClick={() => setState(0)}>Log in</button>
            <button className={state === 1 ? 'active' : ''} onClick={() => setState(1)}>Sign up</button>
          </div>
          {renders[state]}
        </div>
      </div>
    </>
  );
};

Auth.propTypes = {
  changeState: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
};

export default Auth;
