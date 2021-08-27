import EventBus from './EventBus';

export default class SetGameProcessor {
  constructor() {
    this.id = null;

    EventBus.$on('backendComms', (data) => {
      if (data.event === 'MESSAGE_RECEIVED') {
        if (data.data !== null) {
          const message = JSON.parse(data.data.data);
          console.log(`type: ${message.type}`);
          EventBus.$emit('SET_PROCESSOR_DATA', message);
        }
      }
    });

    EventBus.$on('SET_PROCESSOR_CMD', (data) => {
      console.log('proc cmd');
      if (data.cmd === 'REQUEST_BOARD') {
        console.log('sending');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'REQUEST_BOARD', data: {} } });
      }
      if (data.cmd === 'SUBMIT_SET') {
        console.log('SUBSET');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'SUBMIT_SET', data: data.data } });
      }
      if (data.cmd === 'SUBMIT_NO_SET') {
        console.log('SUBNOSET');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'SUBMIT_NO_SET', data: data.data } });
      }
      if (data.cmd === 'SET_CONN_TYPE') {
        console.log('SETCONNTYPE');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'SET_CONN_TYPE', data: data.data } });
      }
      if (data.cmd === 'SET_NAME') {
        console.log('SETNAME');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'SET_NAME', data: data.data } });
      }
      if (data.cmd === 'REQUEST_ID') {
        console.log('SETNAME');
        EventBus.$emit('backendComms', { event: 'MESSAGE_SEND', data: { cmd: 'REQUEST_ID', data: data.data } });
      }
    });
  }
}
