import Ember from 'ember';

export default Ember.Object.extend({
  username: function(key, value){
    if (arguments.length > 1) {
      // set property
      localStorage.setItem('username', value);
      return value;
    }

    // get property
    var username = localStorage.getItem('username');
    if (!Ember.isEmpty(username)) {
      return username;
    }

    // set random username
    username = Math.random().toString(36).substr(2,6);
    localStorage.setItem('username', username);
    return username;
  }.property()
});
