import Ember from 'ember';

// provides a too simple model layer

export default Ember.Object.extend({
  pouchdb: Ember.inject.service(),
  session: Ember.inject.service(),

  // default values
  _id: function() {
    return Math.random().toString(36).substr(2, 10);
  }.property(),
  user: function() {
    return this.get('content.user') || this.get('session.username');
  }.property('content.user', 'session.username'),
  normalizedTopic: function() {
    return (this.get('topic') || '').trim().toLowerCase();
  }.property('topic'),

  // CRUD functions
  load: function() {
    var docId = this.get('_id');
    var self = this;

    this.get('pouchdb.db').get(docId).then(
      function(doc) {
        self.setProperties(doc);
      },
      function(/*error*/) {} // skip errors
    );
    return this;
  },
  save: function() {
    var doc = this.getProperties('_id', '_rev', 'user', 'topic');

    if (Ember.isEmpty(doc._rev)) {
      delete doc._rev;
    }
    this.get('pouchdb.db').put(doc);
    return this;
  },
  remove: function() {
    var doc = this.getProperties('_id', '_rev');

    if (!Ember.isEmpty(doc._rev)) {
      this.get('pouchdb.db').remove(doc);
    }
    return this;
  }
});