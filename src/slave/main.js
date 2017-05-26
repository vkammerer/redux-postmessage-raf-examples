import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { objectPropsToArray } from "../common/utils";
import concat from "xstream/extra/concat";

const delayedActions$ = xs.fromArray(
  [...Array(1000).keys()].map((n, i) => ({
    type: "ANIMATION",
    payload: i,
    meta: {
      toMain: true,
      delay: { index: i + 2 }
    }
  }))
);

const App = sources => {
  const state$ = sources.STATE;
  const action$ = sources.ACTION;
  const firebase$ = sources.firebase;

  // TICKER
  const toggleAction$ = action$.filter(a => a.type === "PING_TOGGLE");
  const isTicking$ = state$.map(state => state.ticking);
  const toggleSink$ = toggleAction$
    .compose(sampleCombine(isTicking$))
    .map(([, isTicking]) =>
      xs.fromArray([
        {
          type: !isTicking ? "PING_START" : "PING_STOP"
        },
        {
          type: !isTicking ? "PING_START" : "PING_STOP",
          meta: { toMain: true }
        }
      ])
    )
    .flatten();

  const pingAction$ = action$.filter(a => a.type === "PONG");
  const animationAction$ = pingAction$.map(a => ({
    type: "ANIMATION",
    payload: a.payload.count,
    meta: {
      toMain: true,
      delay: { count: a.payload.count + 2 }
    }
  }));

  // const pingAction$ = action$.filter(a => a.type === "PONG");
  // const pingCountIs10$ = pingAction$
  //   .map(a => a.payload.count)
  //   .filter(count => count === 10)
  //   .take(1);
  // const animationAction$ = concat(pingCountIs10$, delayedActions$).drop(1);

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

  const actionSink$ = xs.merge(
    toggleSink$,
    nameSink$,
    articlesSink$,
    animationAction$
  );
  return {
    ACTION: actionSink$
  };
};

export default App;
