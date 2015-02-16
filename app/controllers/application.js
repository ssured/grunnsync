import Ember from 'ember';

var CounterHelper = Ember.Object.extend({
  controller: null,
  topic: '',

  docsForTopic: Ember.computed.filter('controller.allDocs.@each.topic', function(doc){
    return doc.get('normalizedTopic') === this.get('topic');
  }),

  usersForTopic: Ember.computed.mapBy('docsForTopic', 'user'),
  uniqUsers: Ember.computed.uniq('usersForTopic'),
  count: Ember.computed.alias('uniqUsers.length')
});

export default Ember.Controller.extend({
  pouchdb: Ember.inject.service(),
  session: Ember.inject.service(),
  connection: Ember.inject.service(),

  topic: '',

  allDocs: Ember.computed.alias('pouchdb.allDocs'),

  myDocs: Ember.computed.filter('allDocs.@each.user', function(doc) {
    return doc.get('user') === this.get('session.username');
  }),

  // create sorted list of all topics
  allTopics: Ember.computed.mapBy('allDocs', 'normalizedTopic'),
  uniqTopics: Ember.computed.uniq('allTopics'),
  nonEmptyTopics: Ember.computed.filter('uniqTopics', function(topic) {
    return !Ember.isEmpty(topic);
  }),
  topics: Ember.computed.map('nonEmptyTopics', function(topic) {
    return CounterHelper.create({
      controller: this,
      topic: topic
    });
  }),
  sortedBy: ['count:desc'],
  sortedTopics: Ember.computed.sort('topics', 'sortedBy')
});