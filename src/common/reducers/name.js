const defaultState = {
  name: ""
};

export const name = (state = defaultState, action) => {
  switch (action.type) {
    case "NAME_SET":
      return {
        ...state,
        name: action.payload
      };
    default:
      return state;
  }
};
