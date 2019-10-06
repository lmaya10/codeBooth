import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';
import '../styles/Explorer.css';
import { formatDate } from '../utils/date';

const Explore = ({ documents, showDocument }) => {
  return (
    <div id="explorer">
      <span>Explore Scripts</span>
      <div id="document-container">
        {documents.map((d, i) => (
          <div key={i} className="document-card" onClick={() => showDocument(d)}>
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
  documents: PropTypes.array,
  showDocument: PropTypes.func.isRequired
};

export default withTracker(() => {
  Meteor.subscribe('documents');

  return {
    documents: Documents.find({}).fetch()
  };
})(Explore);