import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { callToColl } from '../utils/mongo';

export const Documents = new Mongo.Collection('documents');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('documents', function tasksPublication() {
    return Documents.find();
  });
}

Meteor.methods({
  'document.create'(title, text) {
    if (!this.userId) {
      throw new Meteor.Error('Not Authorized');
    }

    return callToColl(Documents, 'insert', {
      title,
      text,
      ownerId: this.userId,
      createdAt: new Date(),
      username: Meteor.users.findOne(this.userId).username,
      sharedWith: [],
      lastModified: new Date()
    });
  },
  'document.update'(docId, title, text) {
    if (!this.userId) {
      throw new Meteor.Error('Not Authorized');
    }

    const doc = Documents.findOne({ _id: docId });
    if (doc) {
      const ownerId = doc.ownerId;
      const editableFor = doc.sharedWith.filter(s => ['Editor', 'Owner'].includes(s.rol)).map(s => s.username);
      if (ownerId === Meteor.user()._id || editableFor.includes(Meteor.user().username)) {
        return callToColl(Documents, 'update', { _id: docId }, {
          $set: {
            title,
            text,
            lastModified: new Date()
          }
        });
      }
      else {
        throw new Meteor.Error('Not Authorized');
      }
    }
    // else {
    //   throw new Meteor.Error('No Document');
    // }
  }
});
