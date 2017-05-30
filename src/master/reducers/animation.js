export const animation = (state = { scale: 0 }, action) => {
  switch (action.type) {
    case "ANIMATION":
      return {
        ...state,
        scale: action.payload
      };
    default:
      return state;
  }
};
