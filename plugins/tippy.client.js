import Vue from 'vue';
import VueTippy, { TippyComponent } from 'vue-tippy';

Vue.use(VueTippy, {
  arrow: true
});

Vue.component('Tippy', TippyComponent);
