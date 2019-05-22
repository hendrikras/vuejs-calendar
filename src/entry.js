import Vue from 'vue';
import store from './store';

import moment from 'moment-timezone';

Object.defineProperty(Vue.prototype, '$moment', {
  get() {
    return this.$root.moment
  }
});

import App from './components/App.vue';


export default function (events) {
  let initialState = Object.assign({}, store.state, {events})
  store.replaceState(initialState);

  return new Vue({
    el: '#app',
    data: {moment},
    components: {
      App
    },
    store,
    render: CreateElement =>
      CreateElement('div',
        {attrs: {id: 'app'}},
        [CreateElement('app')])

  })
  ;

}
