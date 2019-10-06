import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';
import '../styles/Dashboard.css';
import { formatDate } from '../utils/date';

const Dashboard = ({ myDocuments, createDoc, showDocument }) => {
  return (
    <div id="dashboard">
      <span>My Dashboard</span>
      <div>
        <button onClick={() => createDoc()}>
          <i className="fas fa-plus" />
        </button>
        <div id="document-container">
          {myDocuments.map((d, i) => (
            <div key={i} className="document-card" onClick={() => showDocument(d)}>
              <span>{d.title}</span>
              <span>{formatDate(d.createdAt)}</span>
              <span>{d.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  myDocuments: PropTypes.array,
  createDoc: PropTypes.func.isRequired,
  showDocument: PropTypes.func.isRequired
};

export default withTracker((props) => {
  Meteor.subscribe('documents');
  const query = { username: Meteor.user().username };
  return {
    myDocuments: Documents.find(query).fetch(),
    ...props
  };
})(Dashboard);