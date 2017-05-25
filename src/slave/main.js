import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { objectPropsToArray } from "../common/utils";

const App = sources => {
  const state$ = sources.STATE;
  const action$ = sources.ACTION;
  const firebase$ = sources.firebase;

  // TICKER
  const toggleAction$ = action$.filter(a => a.type === "TICK_TOGGLE");
  const isTicking$ = state$.map(state => state.ticking);
  const toggleSink$ = toggleAction$
    .compose(sampleCombine(isTicking$))
    .map(([, isTicking]) => ({
      type: !isTicking ? "TICK_START" : "TICK_STOP",
      meta: { toMain: true }
    }));

  // NAME
  const nameAction$ = action$.filter(a => a.type === "NAME_GET");
  const nameSink$ = nameAction$.mapTo({
    type: "NAME_SET",
    payload: { name: "Jack" },
    meta: { toMain: true }
  });

  // ARTICLES
  const articlesAction$ = action$.filter(a => a.type === "ARTICLES_GET");
  const articlesData$ = firebase$
    .on("articles", "value")
    .map(a => objectPropsToArray(a));
  const articlesSink$ = xs
    .combine(articlesData$, articlesAction$)
    .map(arr => arr[0])
    .map(articles => ({
      type: "ARTICLES_SET",
      payload: { articles },
      meta: { toMain: true }
    }));

  const actionSink$ = xs.merge(toggleSink$, nameSink$, articlesSink$);
  return {
    ACTION: actionSink$
  };
};

export default App;
