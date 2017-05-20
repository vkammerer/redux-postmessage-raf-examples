import React from "react";
import { connect } from "react-redux";

const articlesAction = {
  type: "ARTICLES_GET",
  meta: { toWorker: true }
};

const Articles = props => (
  <div>
    <h3>Articles</h3>
    <p>
      Get the firebase articles from the cyclejs application in the worker.
    </p>
    <button onClick={() => props.dispatch(articlesAction)}>
      Get articles
    </button>
    <div className="output">
      <ul>
        {props.articles.map(a => (
          <li key={a.key}>{a.value.username} said: {a.value.content}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default connect(state => ({ articles: state.articles }))(Articles);
