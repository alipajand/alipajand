import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
  createPersistedState({
    key: 'store',
    paths: ['isDark']
  })(store);
};
