import { Meteor } from 'meteor/meteor';

export const call = (name, ...args) => {
  return new Promise((resolve, reject) => {
    Meteor.call(name, ...args, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
};

export const callToColl = (collection,method, ...doc) => {
  return new Promise((resolve, reject) => {
    collection[method](...doc, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
};
