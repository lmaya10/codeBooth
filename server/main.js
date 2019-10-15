import { Meteor } from 'meteor/meteor';
import '../imports/api/users';
import '../imports/api/documents';
import { WebApp } from 'meteor/webapp';


Meteor.startup(() => {
  WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
});
