<template>
  <div>
    <div id="settingsModal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Options</p>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" v-model="nameInput">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button v-on:click="sendSettings()" class="button is-success">Save changes</button>
          <button v-on:click="cancelSettings()" class="button">Cancel</button>
        </footer>
      </div>
    </div>
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{lastIdent.setsFound}}</strong> sets
          </p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <a v-on:click="showSettings()" class="button is-link">Set Name</a>
        </div>
      </div>
    </nav>
    <section>
    <div class="columns is-0 is-mobile">
      <div class="column is-4">
          <div v-for="card in cols.left" 
          v-bind:key="card.index" 
          v-on:click="toggleCardSelect(card.index)"
          v-bind:class="{'is-not-select-bg': !(card.index in selectedCards), 'is-select-bg': card.index in selectedCards}"
          class="is-slightly-margin">
            <img class="is-hundred-width" v-bind:src="getCard(card.image)">
          </div>
      </div>
      <div class="column is-4">
          <div v-for="card in cols.center"
          v-bind:key="card.index" 
          v-on:click="toggleCardSelect(card.index)"
          v-bind:class="{'is-not-select-bg': !(card.index in selectedCards), 'is-select-bg': card.index in selectedCards}"
          class="is-slightly-margin">
            <img class="is-hundred-width" v-bind:src="getCard(card.image)">
          </div>
      </div>
      <div class="column is-4">
          <div v-for="card in cols.right" 
          v-bind:key="card.index" 
          v-on:click="toggleCardSelect(card.index)"
          v-bind:class="{'is-not-select-bg': !(card.index in selectedCards), 'is-select-bg': card.index in selectedCards}"
          class="is-slightly-margin">
            <img class="is-hundred-width" v-bind:src="getCard(card.image)">
          </div>
      </div>
    </div>
    </section>
    <section class="hero is-medium">
     <div class="columns is-mobile">
        <div class="column is-two-fifths">
          <a class="button tall-thing is-large is-primary is-fullwidth"
           v-on:click="submitNoSet()">
            No Set Present
          </a>
      </div>
      <div class="column is-three-fifths">
          <a class="button is-large tall-thing is-danger is-fullwidth"
           v-on:click="submitSet()">
            Set!
          </a>
      </div>
      </div>
    </section>
  </div>
</template>

<script>
import EventBus from '@/models/EventBus';
import SetCardClassifier from '@/models/SetCardClassifier';

export default {
  name: 'SetGame',
  data() {
    return  {
      connected: false,
      gameId: -1,
      boardId: -1,
      currentCards: {updated: false, cards: []},
      selectedCards: {},
      cols: {left: {}, center: {}, right: {}},
      myServerId: null,
      lastIdent: {name:'???', setsFound:0, $DUMMY:true},
      nameInput: '???',
    }
  },
  methods: {
    getCard (index) {
      return require(`@/assets/cards/${index}.gif`);
    },
    toggleCardSelect(index) {
      console.log(this.selectedCards);
      if(index in this.selectedCards) {
        delete this.selectedCards[index];
      }
      else {
        this.selectedCards[index] = index;
      }
      this.$forceUpdate();
    },
    submitSet() {
      console.log('submitSetExec');
      if(Object.keys(this.selectedCards).length == 3) {
        const setCards = [];
        Object.values(this.selectedCards).forEach((index) => {
          if(index >= this.currentCards.cards.length) {
            // fail
            return;
          }
          else {
            setCards.push({index, card:this.currentCards.cards[index].data});
          }
        });
        console.log('emitting');
        EventBus.$emit('SET_PROCESSOR_CMD', {cmd:'SUBMIT_SET', data:{set: setCards}});
      }
    },
    submitNoSet() {
      EventBus.$emit('SET_PROCESSOR_CMD', {cmd:'SUBMIT_NO_SET', data:{boardId: this.boardId}});
    },
    resetCols() {
      this.cols = {left: [], center: [], right: []};
      this.selectedCards = {};
      for(let i = 0; i < this.currentCards.cards.length; i += 1) {
        const item = {index:i, image:this.currentCards.cards[i].image};
        if(i % 3 === 0) {
          this.cols.left.push(item);
        }
        else if(i % 3 === 1) {
          this.cols.center.push(item);
        }
        else {
          this.cols.right.push(item);
        }
      }
    },
    showSettings() {
    document.getElementById("settingsModal").classList.add('is-active');
    },
    sendSettings() {
      EventBus.$emit('SET_PROCESSOR_CMD', {cmd:'SET_NAME', data:{name: this.nameInput}});
      document.getElementById("settingsModal").classList.remove('is-active');
    },
    cancelSettings() {
      document.getElementById("settingsModal").classList.remove('is-active');
    },
  },
  mounted() {
    EventBus.$on('SET_PROCESSOR_DATA', (data) => {
      console.log(data);
      if(data.type === 'BOARD') {
        console.log(`boardId:${data.data.boardId}`)
        if(data.data.boardId === this.boardId) {
          return;
        }

        this.boardId = data.data.boardId;
        let cards = [];
        for(let i = 0; i < data.data.board.length; i += 1)
        {
          const element = data.data.board[i];
          cards.push({data:element, image:SetCardClassifier.getIndexFromCard(element)});
        }
        this.currentCards.cards = cards;
        this.currentCards.updated = true;
        this.resetCols();
      }
      if(data.type === 'ID') {
        this.myServerId = data.data.id;
      }
      if(data.type === 'PLAYERS') {
        const matchedIds = data.data.playerList.filter(player => player.id === this.myServerId);
        if(matchedIds.length > 0) {
          if('$DUMMY' in this.lastIdent) {
            this.nameInput = matchedIds[0].name;
          }

          this.lastIdent = matchedIds[0];
        }
      }
    });

    EventBus.$on('backendComms', (data) => {
      if(data.event === 'OPENED') {
        this.connected = true;
        EventBus.$emit('SET_PROCESSOR_CMD', {cmd: 'REQUEST_ID'});
        EventBus.$emit('SET_PROCESSOR_CMD', {cmd: 'REQUEST_BOARD'});
      }
      else if(data.event === 'CLOSED') {
        this.connected = false;
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.is-hundred-width {
  width:100%;
  padding:10px;
}

.is-slightly-margin {
  padding:0px;
  margin:0px;
}

.is-not-select-bg {
  background-color: blue;
}

.is-select-bg {
  background-color: red;
}

.night-text {
  color:white;
}

.tall-thing {
  height: 15vh;
}
</style>
