import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class Documents extends React.Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

Documents.propTypes = {

};


export default withTracker(() => {
  Meteor.subscribe('documents');
})(Documents);
