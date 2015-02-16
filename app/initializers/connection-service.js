export function initialize(container, application) {
  application.inject('route', 'connectionService', 'service:connection');
}

export default {
  name: 'connection-service',
  initialize: initialize
};
