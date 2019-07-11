"use strict";
const storageid = 'spielstore';
var cfg = {
  version: '0.1',
  persist: false 
}

class Werte {
  constructor(typ, boylie) {
    this.typ = typ;
    this.boylie = boylie;
    this.counter = 0;
  }
  
}


/*----------------------------------*/
Vue.filter('euro', function (value) {
  if (!value) return '0.00 €'
  let result = value * 0.5;
  return result.toString() + ' €';
})
/*----------------------------------*/
// Define a new component called button-counter
Vue.component('button-counter', {
  props: ['wert'],
  data: function () {
    return {

      counter: 0
    }
  },
  beforeMount: function(){
    this.sync();
  },
  methods: {
    sync: function () {
      this.counter = this.wert.counter;
    },
    inc: function () {
      this.wert.counter += 1;
      this.sync();
    },

    dec: function () {
      this.wert.counter -= 1;
      this.sync();
    }
  },
  template: '<span><button class="btn btn-outline-success" v-on:click="inc">+</button> \
  <span class="counter">{{counter}}</span> \
  <button class="btn btn-outline-danger"  v-on:click="dec">-</button> </span>'
})

/*----------------------------------*/
var app = new Vue({
  el: '#app',
  data: {
    version: cfg.version,
    spiel: { jahr: '', monat: '', gastgeber: '' },
    boylies: ['Uwe', 'Fedde', 'Hubi', 'Ludger', 'Schnitte', 'Guido'],
    typen: ['Runde', 'AK', 'Hälfte', 'Out', 'Out Alle', 'Drei Harte', 'Strafen'],
    bewertung: {
      'Uwe': {}, 'Fedde': {}, 'Hubi': {}, 'Ludger': {},
      'Schnitte': {}, 'Guido':  {}
    },
    active: {
      'Uwe': true, 'Fedde': true, 'Hubi': true, 'Ludger': true,
      'Schnitte': true, 'Guido':  true
    },
    summe: {
      'Uwe': 0, 'Fedde': 0, 'Hubi': 0, 'Ludger': 0,
      'Schnitte': 0, 'Guido': 0, 'Gesamt': 0, 'Schnitt':0
    }
  },
  beforeMount: function () {
    this.init();
    this.load();

  },
  methods: {
    toggleActive: function(boylie){
        this.active[boylie]=!this.active[boylie];
    },
    save: function () {
      let comp = this.composite();
      if(cfg.persist){
        window.localStorage.setItem(storageid, JSON.stringify(comp));  
      }else{
        window.sessionStorage.setItem(storageid, JSON.stringify(comp));

      }
          },
    load: function () {
      let spielStr = cfg.persist ? window.localStorage.getItem(storageid):window.sessionStorage.getItem(storageid);
      if (spielStr) {
        let comp=JSON.parse(spielStr);
        this.setComposite(comp);
      } 
    
    },
    composite: function(){
        return {
         spiel: this.spiel,
         bewertung: this.bewertung,
         summe: this.summe
       };
    },
    setComposite: function(comp){
        if(comp){
          this.spiel = comp.spiel;
          this.bewertung = comp.bewertung;
          this.summe= comp.summe;
        }
       
    },
    
    calcAll: function () {
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        if(this.active[name]){
          this.calc(name);
        }
              }
    },
    calc: function (boylie) {
      let result = 0.0;
      let arr = this.bewertung[boylie];
      for (var propt in arr) {
        const element = arr[propt];
        result += this.berechne(element);
      }
      this.summe[boylie] = result;
    },
    berechne(element) {
      switch (element.typ) {
        case 'Runde': return element.counter * 2.5; break;
        case 'AK': return element.counter * 5; break;
        case 'Hälfte': return element.counter * 0.5; break;
        case 'Out': return element.counter * 1; break;
        case 'Out Alle': return element.counter * 1; break;
        case 'Drei Harte': return element.counter * 1; break;
        case 'Strafen': return element.counter * 0.5; break;
      }
    },
    
    init() {
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        for (let index1 = 0; index1 < this.typen.length; index1++) {
          const typ = this.typen[index1];

          this.bewertung[name][typ] = new Werte(typ, name);
        }
      }
    }
  }
})
