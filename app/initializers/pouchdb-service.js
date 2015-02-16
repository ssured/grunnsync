export function initialize(container, application) {
  application.inject('route', 'pouchdbService', 'service:pouchdb');
}

export default {
  name: 'pouchdb-service',
  initialize: initialize
};
