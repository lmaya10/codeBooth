import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';
import '../styles/Dashboard.css';
import { formatDate } from '../utils/date';
import { call } from '../utils/mongo';

const Dashboard = ({ myDocuments, createDoc, showDocument }) => {

  const [showDialog, setShowDialog] = useState({ show: false, docId: undefined });


  const confirmDelete = () => {
    (async () => {
      await call('document.delete', showDialog.docId);
      setShowDialog({ show: false, docId: undefined });
    })();
  };

  const clickH = (st, docId) => {
    return (e) => {
      e.stopPropagation();
      switch (st) {
        case 0:
          setShowDialog({ show: true, docId });
          break;
        case 1:
          break;
      }
    };
  };

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
              <div>
                <button onClick={clickH(0, d._id)}>
                  <i className="fas fa-trash" />
                </button>
                <button onClick={clickH(1, d._id)}>
                  <i className="fas fa-share-alt" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="confirm-dialog" className={showDialog.show ? '' : 'hidden'}>
        <div></div>
        <div>
          <div><span>Are you sure you want to delete this document?</span></div>
          <div>
            <button onClick={() => setShowDialog({ show: false, docId: undefined })}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
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
  const user = Meteor.user();
  const query = { username: user && user.username };
  return {
    myDocuments: Documents.find(query).fetch(),
    ...props
  };
})(Dashboard);