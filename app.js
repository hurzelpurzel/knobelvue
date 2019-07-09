class Werte {
  constructor(typ, boylie) {
    this.typ=typ;
    this.boylie=boylie;
    this.counter = 0;
  }
  berechne() {
    switch (this.typ) {
      case 'Runde': return this.counter * 2.5; break;
      case 'AK': return this.counter * 5; break;
      case 'Hälfte': return this.counter * 0.5; break;
      case 'Out': return this.counter * 1; break;
      case 'Out Alle': return this.counter * 1; break;
      case 'Drei Harte': return this.counter * 1; break;
      case 'Strafen': return this.counter * 0.5; break;
    }
  }
}
Vue.filter('euro', function (value) {
  if (!value) return  '0.00 €'
  result = value * 0.5;
  return result.toString() +' €';
})
// Define a new component called button-counter
Vue.component('button-counter', {
  props: ['wert'],
  data: function () {
    return {
     
      counter: 0
    }
  },
  
  methods: {
    inc: function () {
      this.wert.counter += 1;
      this.counter = this.wert.counter;
    },

    dec: function () {
      this.wert.counter -= 1;
      this.counter = this.wert.counter;
    }
  },
  template: '<span><button class="btn btn-outline-success" v-on:click="inc">+</button> \
  <span class="counter">{{counter}}</span> \
  <button class="btn btn-outline-danger"  v-on:click="dec">-</button> </span>'
})


var app = new Vue({
  el: '#header',
  data: {
    greeting: 'Hallo Boylies !'

  },
  methods: {
    humanizeURL: function (url) {
      return url
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
    }
  }
})
var content = new Vue({
  el: '#content',
  data: {
    boylies: ['Uwe', 'Fedde', 'Hubi', 'Ludger', 'Schnitte', 'Guido'],
    typen: ['Runde', 'AK', 'Hälfte', 'Out', 'Out Alle', 'Drei Harte', 'Strafen'],
    bewertung: {
      'Uwe': new Array(), 'Fedde': new Array(), 'Hubi': new Array(), 'Ludger': new Array(),
      'Schnitte': new Array(), 'Guido': new Array()
    },
    summe: {
      'Uwe': 0, 'Fedde': 0, 'Hubi': 0, 'Ludger': 0,
      'Schnitte': 0, 'Guido': 0, 'Gesamt':0
    }

  },


  methods: {
    calcAll: function(){
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        this.calc(name);
      }
    },
    calc: function (boylie) {
      let result = 0.0;
      let arr = this.bewertung[boylie];
      for(var propt in arr){
        const element = arr[propt];
        result += element.berechne();
      }
      this.summe[boylie]=result;
    }
  },
  beforeMount: function () {
    for (let index = 0; index < this.boylies.length; index++) {
      const name = this.boylies[index];
      for (let index1 = 0; index1 < this.typen.length; index1++) {
        const typ = this.typen[index1];

        this.bewertung[name][typ] = new Werte(typ, name);
      }
    }


  }
})
