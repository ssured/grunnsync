import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    addTopic: function(topic) {
      topic = topic || this.controller.get('topic');
      if (Ember.isEmpty(topic)) {
        return;
      }

      var Doc = this.container.lookupFactory('model:doc');
      Doc.create({
        topic: topic
      }).save();

      this.set('controller.topic', '');
    },
    removeTopic: function(topic) {
      topic.remove();
    }
  }
});