/*global PouchDB:false */

import Ember from 'ember';

export default Ember.Object.extend({
  db: new PouchDB('topics'),

  allDocIds: function() {
    var docs = Ember.A([]);

    this.db.allDocs().then(function(response) {
      console.log('got allDocIds', response);
      response.rows.forEach(function (row) {
        docs.addObject(row.id);
      });
    });

    return docs;
  }.property(),

  allDocs: Ember.computed.map('allDocIds', function(id) {
    var Doc = this.container.lookupFactory('model:doc');

    return Doc.create({_id: id}).load();
  }),

  listenForChanges: function() {
    var allDocIds = this.get('allDocIds');
    var allDocs = this.get('allDocs');

    this.db.changes({
      live: true,
      since: 'now'
    })
    .on('change', function(change) {
      var rev = change.changes[0].rev;

      console.log('got change', change);

      if (change.deleted) {
        // document is deleted, remove
        allDocIds.removeObject(change.id);
      } else {
        if (parseInt(rev, 10) === 1) {
          // new document, add
          allDocIds.addObject(change.id);
        } else {
          // document changed, reload if we do not have the current rev
          var doc = allDocs.filterBy('_id', change.id)[0];
          if (doc && doc.get('_rev') !== rev) {
            doc.load(); // reload
          }
        }
      }
    });
  }.on('init'),


  connection: Ember.inject.service(),
  sync: null,
  syncStatus: '',
  initSync: function() {
    var sync = this.get('sync');
    if (sync && sync.cancel) {
      sync.cancel();
    }

    if (!this.get('connection.isOnline')) {
      this.set('syncStatus', '');
      return;
    }

    // some browsers need some time after coming online to get xhr
    // requests working...
    Ember.run.later(this, function() {
      var self = this;
      this.set('sync', this.db.sync("http://grunnjs.iriscouch.com/topics", {
          live: true,
          retry: true
        })
        .on('paused', function(error){
          Ember.run(function(){
            self.set('syncStatus', !!error ? 'retrying' : 'synced');
          });
        })
        .on('active', function(){
          Ember.run(function(){
            self.set('syncStatus', 'syncing');
          });
        })
        .on('error', function(/*error*/){
          Ember.run(function(){
            self.set('syncStatus', 'errored');
          });
        })
      );
    }, 100);
  }.observes('connection.isOnline').on('init')
});
