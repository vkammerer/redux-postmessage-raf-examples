const defaultState = {
  pinging: false
};

export const messager = (state = defaultState, action) => {
  switch (action.type) {
    case "PING_START":
      return {
        ...state,
        pinging: true
      };
    case "PING_STOP":
      return {
        ...state,
        pinging: false
      };
    default:
      return state;
  }
};
