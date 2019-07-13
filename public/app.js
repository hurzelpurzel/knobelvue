"use strict";
const storageid = 'spielstore';
var cfg = {
  version: '0.2',
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
  if (value === -1) { return app.summe['Schnitt'].toString() + ' €'; }
  let result = value * 0.5;
  return result.toString() + ' €';
})
/*----------------------------------*/
// Define a new component called button-counter
Vue.component('button-counter', {
  props: ['wert'],
  data: function () {
    return {
      name: this.wert.boylie,
      typ: this.wert.typ,
      
    }
  },
  methods: {
   
    inc: function () {
     
      if(this.typ === 'Out Alle'){
        this.$emit('inco', { 'name': this.name, 'typ' : this.typ});
      }else{
        this.$emit('inc', { 'name': this.name, 'typ' : this.typ});
      }
      
    },

    dec: function () {
      if(this.typ === 'Out Alle'){
        this.$emit('deco', { 'name': this.name, 'typ' : this.typ});
       
      }else    if(this.wert.counter > 0){
        this.$emit('dec', { 'name': this.name, 'typ' : this.typ});
      }
    }
  },
  template: '<span><button class="btn btn-outline-success" v-on:click="inc">+</button> \
  <span class="counter"><slot></slot></span> \
  <button class="btn btn-outline-danger"  v-on:click="dec">-</button> </span>'
})

/*----------------------------------*/
var app = new Vue({
  el: '#app',
  data: {
    version: cfg.version,
    runde: 1,
    spiel: { jahr: '', monat: '', gastgeber: '' },
    boylies: ['Uwe', 'Fedde', 'Hubi', 'Ludger', 'Schnitte', 'Guido'],
    typen: ['Runde', 'AK', 'Hälfte', 'Out', 'Out Alle', 'Drei Harte', 'Strafen'],
    bewertung: {
      'Uwe': {}, 'Fedde': {}, 'Hubi': {}, 'Ludger': {},
      'Schnitte': {}, 'Guido': {}
    },
    active: {
      'Uwe': true, 'Fedde': true, 'Hubi': true, 'Ludger': true,
      'Schnitte': true, 'Guido': true
    },
    summe: {
      'Uwe': 0, 'Fedde': 0, 'Hubi': 0, 'Ludger': 0,
      'Schnitte': 0, 'Guido': 0, 'Gesamt': 0, 'Schnitt': 0
    }
  },
  beforeMount: function () {
    this.init();
    this.load();

  },
  methods: {
     incOther: function (event) {
      let me = event.name;
      let typ = event.typ;
        
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        if (this.active[name]&& name !== me) {
          this.bewertung[name][typ].counter =+1;
        }
      }
      this.calcAll();
    },
    decOther: function (event) {
      let me = event.name;
      let typ = event.typ;
        
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        if (this.active[name]&& name !== me) {
          this.bewertung[name][typ].counter =-1;
        }
      }
      this.calcAll();
    },
    inc: function(event){
        let name = event.name;
        let typ = event.typ;
        this.bewertung[name][typ].counter += 1;
        this.calcAll();
    },
    dec: function(event){
      let name = event.name;
      let typ = event.typ;
      this.bewertung[name][typ].counter -= 1;
      this.calcAll();
    },
    toggleActive: function (boylie) {
      this.active[boylie] = !this.active[boylie];
      this.initOne(boylie);
   
      if (!this.active[boylie]) {
        this.summe[boylie] = -1;
      }else{
        this.summe[boylie] = 0;
      }
      this.calcAll();
    },
    save: function () {
      let comp = this.composite();
      if (cfg.persist) {
        let store=firestore.firestore();
        window.localStorage.setItem(storageid, JSON.stringify(comp));
      } else {
        window.sessionStorage.setItem(storageid, JSON.stringify(comp));

      }
    },
    load: function () {
      let spielStr = cfg.persist ? window.localStorage.getItem(storageid) : window.sessionStorage.getItem(storageid);
      if (spielStr) {
        let comp = JSON.parse(spielStr);
        this.setComposite(comp);
      }

    },

    calcAll: function () {
      let counter = 0;
      let gesamt = 0;
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];

        if (this.active[name]) {
          counter += 1;
          gesamt += this.calc(name);
        }
        this.summe['Gesamt'] = gesamt;
        this.summe['Schnitt'] = gesamt / counter;
      }
      this.calcRunde();
    },
    /* ---------------------private section --------------------*/
    calc: function (boylie) {
      let result = 0.0;
      let arr = this.bewertung[boylie];
      for (var propt in arr) {
        const element = arr[propt];
        result += this.berechne(element);
      }
      this.summe[boylie] = result;
      return result;
    },
    calcRunde: function(){
      let res=0;
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        res += this.bewertung[name]['Runde'].counter;
        res += this.bewertung[name]['AK'].counter;
      }  
      this.runde=res+1;
    },
    berechne: function(element) {
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
    composite: function () {
      return {
        spiel: this.spiel,
        bewertung: this.bewertung,
        summe: this.summe
      };
    },
    setComposite: function (comp) {
      if (comp) {
        this.spiel = comp.spiel;
        this.bewertung = comp.bewertung;
        this.summe = comp.summe;
      }

    },

    init() {
      for (let index = 0; index < this.boylies.length; index++) {
        const name = this.boylies[index];
        this.initOne(name);
      }
    },

    initOne(name) {
      for (let index1 = 0; index1 < this.typen.length; index1++) {
        const typ = this.typen[index1];

        this.bewertung[name][typ] = new Werte(typ, name);
      }
      this.summe[name] = 0;
    }
  }
})
