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
      if (this.newRequestMethod === 'GET' || this.newRequestMethod === 'POST') {
        this.sendFormRequest();
      } else {
        this.sendAjaxRequest();
      }
    },
    sendFormRequest() {
      const form = document.createElement('form');
      form.setAttribute("action", `${this.host}${this.newRequestUrl}`);
      form.setAttribute('method', this.newRequestMethod);
      document.body.appendChild(form);
      form.submit();
    },
    sendAjaxRequest() {
      axios({
        url: this.newRequestUrl,
        method: this.newRequestMethod,
        headers: {
          Accept: 'text/html',
        },
      }).then((res) => {
        window.history.pushState({}, '', `${this.host}${this.newRequestUrl}`);
        window.scroll(0, 0);
        this.replaceDocument(res.data);
      },
      (err) => {
        this.replaceDocument(err.response.data);
      });
    },
    replaceDocument(newDocument) {
      const doc = document.open('text/html');
      doc.write(newDocument);
      doc.close();
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
