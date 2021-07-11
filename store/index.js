export const state = () => ({
  isDark: false,
  isRTL: false
});

export const getters = {
  isDark: (state) => state.isDark,
  isRTL: (state) => state.isRTL
};

export const actions = {};

export const mutations = {
  SET: (state, payload) => {
    for (const [key, value] of Object.entries(payload)) {
      state[key] = value;
    }
  },
  TOGGLE: (state, name) => (state[name] = !state[name])
};
