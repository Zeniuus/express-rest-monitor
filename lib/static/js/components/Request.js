import Vue from 'vue';
import axios from 'axios';

/* TODO: get newRequestUrl as input. */
const Request = Vue.component('request', {
  template: `
  <div>
    <p>{{ optionsStr }}</p>
    <label for="newRequestUrlInput">{{ host }}</label>
    <input id="newRequestUrlInput" @input="debouncedRefreshOptions" v-model="newRequestUrl" />
    <select v-model="newRequestMethod">
      <option v-for="option in optionsList">{{ option }}</option>
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
      debounced: undefined,
    };
  },
  computed: {
    optionsStr() {
      return this.options.length === 0 ? 'No such url exists!' : this.options.join(',');
    },
    optionsList() {
      return this.options.length === 0 ? ['no available method'] : this.options;
    },
  },
  methods: {
    debouncedRefreshOptions() {
      /* Tried to use closure as the event handler
       * for input tag, but failed... So just use
       * debounced in data just as parent's variable.
       */
      clearTimeout(this.debounced);
      this.debounced = setTimeout(() => {
        this.refreshOptions(this.newRequestUrl);
      }, 1000);
    },
    sendNewRequest() {
      if (this.newRequestMethod === 'GET' || this.newRequestMethod === 'POST') {
        this._sendFormRequest();
      } else {
        this._sendAjaxRequest();
      }
    },
    _sendFormRequest() {
      const form = document.createElement('form');
      form.setAttribute("action", `${this.host}${this.newRequestUrl}`);
      form.setAttribute('method', this.newRequestMethod);
      document.body.appendChild(form);
      form.submit();
    },
    _sendAjaxRequest() {
      axios({
        url: this.newRequestUrl,
        method: this.newRequestMethod,
        headers: {
          Accept: 'text/html',
        },
      }).then((res) => {
        window.history.pushState({}, '', `${this.host}${this.newRequestUrl}`);
        window.scroll(0, 0);
        this._replaceDocument(res.data);
      },
      (err) => {
        this._replaceDocument(err.response.data);
      });
    },
    _replaceDocument(newDocument) {
      const doc = document.open('text/html');
      doc.write(newDocument);
      doc.close();
    },
    refreshOptions(url) {
      axios.options(url)
        .then((res) => {
          this.options = res.data.split(',').map(option => option.trim());
        },
        (err) => {
          this.options = []
        });
    },
  },
  mounted() {
    this.host = `${window.location.protocol}//${window.location.host}`;
    this.pathname = window.location.pathname;
    this.newRequestUrl = this.pathname;
    this.refreshOptions(this.pathname);
  },
});

export default Request;
