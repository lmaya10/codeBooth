import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';
import '../styles/Explorer.css';
import { formatDate } from '../utils/date';

const Explore = ({ documents }) => {
  return (
    <div id="explorer">
      <span>Explore Scripts</span>
      <div id="document-container">
        {documents.map((d, i) => (
          <div key={i} className="document-card">
            <span>{d.title}</span>
            <span>{formatDate(d.createdAt)}</span>
            <span>{d.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Explore.propTypes = {
  documents: PropTypes.array
};

export default withTracker(() => {
  Meteor.subscribe('documents');

  return {
    documents: Documents.find({}).fetch()
  };
})(Explore);