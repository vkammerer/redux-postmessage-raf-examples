const defaultState = {
  articles: []
};

export const articles = (state = defaultState, action) => {
  switch (action.type) {
    case "ARTICLES_SET":
      return {
        ...state,
        articles: action.payload.articles
      };
    default:
      return state;
  }
};
