import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Users = new Mongo.Collection('cbusers');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function tasksPublication() {
    return Users.find();
  });
}

Meteor.methods({
  'users.insert'(username) {
    Users.insert({
      username
    });
  }
});
