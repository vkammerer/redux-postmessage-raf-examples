const defaultState = {
  name: "John"
};

export const name = (state = defaultState, action) => {
  switch (action.type) {
    case "NAME_SET":
      return {
        ...state,
        name: action.payload.name
      };
    default:
      return state;
  }
};
