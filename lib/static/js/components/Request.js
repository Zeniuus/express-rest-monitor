import Vue from 'vue';
import axios from 'axios';

/* TODO: get newRequestUrl as input. */
const Request = Vue.component('request', {
  template: `
  <div>
    <p>{{ options }}</p>
    <label for="newRequestUrlInput">{{ host }}</label>
    <input id="newRequestUrlInput" v-model="newRequestUrl" />
    <select v-model="newRequestMethod">
      <option v-for="option in options">{{ option }}</option>
    </select>
    <button @click="sendNewRequest">Send!</button>
  </div>`,
  data() {
    return {
      options: [],
      newRequestUrl: '',
      newRequestMethod: 'GET',
      pathname: '',
      host: '',
    };
  },
  methods: {
    sendNewRequest() {
      const form = document.createElement('form');
      form.setAttribute("action", `${window.location.protocol}//${window.location.host}${this.newRequestUrl}`);
      form.setAttribute('method', this.newRequestMethod);
      document.body.appendChild(form);
      form.submit();
    },
  },
  mounted() {
    this.host = `${window.location.protocol}//${window.location.host}`;
    this.pathname = window.location.pathname;
    this.newRequestUrl = this.pathname;
    axios.options(this.pathname)
      .then((res) => {
        this.options = res.data.split(',').map(option => option.trim());
      });
  },
});

export default Request;
