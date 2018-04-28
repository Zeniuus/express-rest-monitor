/* global window: false */
/* eslint-disable no-new */

import Vue from 'vue';
import NavBar from './components/NavBar';
import Request from './components/Request';

window.addEventListener('load', () => {
  new Vue({
    el: '#nav-bar',
    components: { NavBar },
    template: '<NavBar/>',
  });

  new Vue({
    el: '#request-container',
    components: { Request },
    template: '<Request/>',
  });
});
