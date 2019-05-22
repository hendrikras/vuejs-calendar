import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment-timezone';
import Axios from 'axios';

moment.tz.setDefault('UTC');
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentYear: 2019,
    currentMonth: 5,
    eventFormPosX: 0,
    eventFormPosY: 0,
    eventFormActive: false,
    events: [

    ],
    eventFormDate: moment(),
  },
  mutations: {
    setCurrentMonth(state, payload) {
      state.currentMonth = payload;
    },
    setCurrentYear(state, payload) {
      state.currentYear = payload;
    },
    eventFormPos(state, payload) {
      state.eventFormPosX = payload.x;
      state.eventFormPosY = payload.y;
    },
    eventFormActive(state, payload) {
      state.eventFormActive = payload
    },
    addEvent(state, payload) {
      state.events.push(payload);
    },
    eventFormDate(state, payload) {
      state.eventFormDate = payload;
    }
  },
  actions: {
    addEvent(context, payload){
      return new Promise((resolve, reject) => {
        let obj = {
          description: payload,
          date: context.state.eventFormDate
        }

        Axios.post('add-event', obj).then(response => {
          if (response.status === 200) {
            context.commit('addEvent', obj);
            resolve();
          }
          reject();
        });
      })
    }
  }
});
