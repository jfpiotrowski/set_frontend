<template>
  <div id="set-viewer-wrapper">
    <section>
    <div class="columns is-0 is-mobile">
        <div class="column is-4">
          <div class="columns is-0 is-mobile">
            <div class="column is-5">
                  <p class="is-night-mode-text">Player</p>
              </div>
              <div class="column is-3">
                  <p class="is-night-mode-text">Sets in Current Deck</p>
              </div>
              <div class="column is-2">
                  <p class="is-night-mode-text">Decks Won</p>
              </div>
              <div class="column is-2">
                  <p class="is-night-mode-text">Total Sets</p>
              </div>
          </div>
          <div v-for="player in rankedPlayers" class="columns is-0 is-mobile">
              <div class="column is-5">
                  <p class="is-night-mode-text">{{player.name}}</p>
              </div>
              <div class="column is-3">
                  <p class="is-night-mode-text">{{player.setsFoundInCurrentDeck}}</p>
              </div>
              <div class="column is-2">
                  <p class="is-night-mode-text">{{player.decksWon}}</p>
              </div>
              <div class="column is-2">
                  <p class="is-night-mode-text">{{player.setsFound}}</p>
              </div>
          </div>
        </div>
        <div class="column is-4">
            <div class="columns is-not-select-bg is-0 is-mobile">
                <div class="column is-4 is-paddingless">
                    <div v-for="card in cols.left" 
                    v-bind:key="card.index" 
                    class="is-slightly-margin">
                        <img class="is-hundred-width" v-bind:src="getCard(card.image)">
                    </div>
                </div>
                <div class="column is-4 is-paddingless">
                    <div v-for="card in cols.center"
                    v-bind:key="card.index" 
                    class="is-slightly-margin">
                        <img class="is-hundred-width" v-bind:src="getCard(card.image)">
                    </div>
                </div>
                <div class="column is-4 is-paddingless">
                    <div v-for="card in cols.right" 
                    v-bind:key="card.index" 
                    class="is-slightly-margin">
                        <img class="is-hundred-width" v-bind:src="getCard(card.image)">
                    </div>
                </div>
            </div>
        </div>
        <div class="column is-4 no-left-padding">
          <div class="level border-night">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading is-night-mode-text">Cards Left</p>
                <p class="title is-night-mode-text">{{gameStats.cardsLeft}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading is-night-mode-text">Last Set</p>
                <p class="title is-night-mode-text">{{gameStats.lastSetPlayer}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading is-night-mode-text">Streak</p>
                <p class="title is-night-mode-text">{{gameStats.streak}}</p>
              </div>
            </div>
          </div>
          <div v-for="messageData in messageHistory">
            <p v-if="messageData.extra === null" class="is-night-mode-text">{{messageData.message}}</p>
            <div v-if="messageData.extra !== null && 'set' in messageData.extra" class="is-vertical-center">
              <span class="is-night-mode-text">{{messageData.message}}</span>
              <img class="found-set-card" v-bind:src="getCardFromSet(messageData.extra.set[0].card)">
              <img class="found-set-card" v-bind:src="getCardFromSet(messageData.extra.set[1].card)">
              <img class="found-set-card" v-bind:src="getCardFromSet(messageData.extra.set[2].card)">
            </div>
          </div>
          <div>
            <p class="is-night-mode-text border-night-top">Join Instructions: Join wi-fi network SetNet, password <b>"Get1000Sets!!"</b> 
              Browse to http://setgame.  Set name with button in upper right and play Set!
            </p>
          </div>
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
      currentPlayers: [],
      messageHistory:[],
      gameStats:{cardsLeft:0, lastSetPlayer:'?', streak:0, lastId:null},
    }
  },
  computed: {
      rankedPlayers() {
        const sorted = this.currentPlayers.slice().sort((a, b) => {
            return b.setsFound - a.setsFound;
        });
        return sorted
      }
  },
  methods: {
    getCard (index) {
      return require(`@/assets/cards/${index}.gif`);
    },
    getCardFromSet (set) {
      console.log('aSDFASDFADSFASDFASDFSA');
      console.log(JSON.stringify(set));
      const index = SetCardClassifier.getIndexFromCard(set);
      console.log(index);
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
    }
  },
  mounted() {
      document.getElementsByTagName("html")[0].setAttribute("style", "overflow-y:hidden;background-color: black;min-height=100%");
    document.getElementsByTagName("body")[0].setAttribute("style", "background-color: black;min-height=100%");
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

        this.gameStats.cardsLeft = data.data.numDeckCards;
        this.resetCols();
      }
       else if(data.type === 'PLAYERS') {
        console.log(JSON.stringify(data));
        this.currentPlayers = data.data.playerList.filter(player => player.connType === 'PLAYER');
      }
      else if(data.type === 'MESSAGE') {
        console.log(JSON.stringify(data));
        this.messageHistory.unshift(data.data);
        this.messageHistory.splice(10, 1);
      }
      else if(data.type === 'SET_FOUND') {
        console.log(JSON.stringify(data));
        this.gameStats.lastSetPlayer = data.data.name;
        if(data.data.id === this.gameStats.lastId) {
          this.gameStats.streak += 1;
        }
        else {
          this.gameStats.streak = 1;
        }
        this.gameStats.lastId = data.data.id;
      }
    });

    EventBus.$on('backendComms', (data) => {
      if(data.event === 'OPENED') {
        this.connected = true;
        EventBus.$emit('SET_PROCESSOR_CMD', {cmd: 'SET_CONN_TYPE', data:{connType:'VIEWER'}});
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
  background-color: #4d4d4d;
}

.is-select-bg {
  background-color: red;
}

.is-night-mode-text {
  color: white;
}

.border-night {
  border-bottom-style: solid;
  border-width: 2px;
  border-color: silver;
}

.border-night-top {
  border-top-style: solid;
  border-width: 2px;
  border-color: silver;
}

.no-left-padding {
  padding-left:0px;
}

.found-set-card {
  width:60px;
  height:45px;
  padding-left:2px;
  padding-right:2px;
  padding-top:2px;
  padding-bottom:2px;
}

.is-vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
