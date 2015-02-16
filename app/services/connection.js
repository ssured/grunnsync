import Ember from 'ember';

export default Ember.Object.extend({
  isOnline: function() {
    return window.navigator.onLine;
  }.property(),

  _listenOnOffline: function() {
    var self = this;

    var isOnline = function() {
      self.set('isOnline', true);
    };
    var isOffline = function() {
      self.set('isOnline', false);
    };

    // see http://robertnyman.com/html5/offline/online-offline-events.html
    if (window.addEventListener) {
      window.addEventListener('online', isOnline, false);
      window.addEventListener('offline', isOffline, false);
    } else {
      document.body.ononline = isOnline;
      document.body.onoffline = isOffline;
    }
  }.on('init')
});
