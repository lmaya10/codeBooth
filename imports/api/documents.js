import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Documents = new Mongo.Collection('documents');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('documents', function tasksPublication() {
    return Documents.find();
  });
}

Meteor.methods({
  'document.insert'(title) {
    if (!this.userId) {
      throw new Meteor.Error('Not Authorized');
    }

    Documents.insert({
      title,
      text: '',
      ownerId: this.userId,
      createdAt: new Date(),
      username: Meteor.users.findOne(this.userId).username
    });
  }
});
