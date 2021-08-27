<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import EventBus from '@/models/EventBus';

export default {
  mounted() {
    // Show a connected message when the WebSocket is opened.
    this.$options.sockets.onopen = () => {
      EventBus.$emit('backendComms', { event: 'OPENED', data: {} });
      console.log('opened');
    };

    this.$options.sockets.onmessage = (data) => {
      EventBus.$emit('backendComms', { event: 'MESSAGE_RECEIVED', data });
    }

    this.$options.sockets.onclose = () => {
      EventBus.$emit('backendComms', { event: 'CLOSED', data: {} });
    }

    EventBus.$on('backendComms', (data) => {
      if(data.event == 'MESSAGE_SEND') {
        console.log(data.data);
        this.$socket.send(JSON.stringify(data.data));
      }
    });
  }
}
</script>

<style>
@import '../node_modules/bulma/css/bulma.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
