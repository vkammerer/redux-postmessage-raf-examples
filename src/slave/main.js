import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { firebaseActions } from "@joshforisha/cycle-firebase";
import { objectPropsToArray } from "../common/utils";
import concat from "xstream/extra/concat";
import dropUntil from "xstream/extra/dropUntil";

const FRAMES_TILL_FULL = 80;
const getScale = pingCount => pingCount % FRAMES_TILL_FULL / FRAMES_TILL_FULL;

const delayedActions = xs.fromArray(
  [...Array(1000).keys()].map((n, i) => ({
    type: "ANIMATION",
    payload: getScale(i),
    meta: {
      toMain: true,
      delay: { index: i + 50 }
    }
  }))
);

const App = sources => {
  const state$ = sources.STATE;
  const action$ = sources.ACTION;

  // PING START / STOP
  const toggleAction$ = action$.filter(a => a.type === "PING_TOGGLE");
  const isPinging$ = state$.map(state => state.messager.pinging);
  const toggleSink$ = toggleAction$
    .compose(sampleCombine(isPinging$))
    .map(([, isPinging]) => ({
      type: !isPinging ? "PING_START" : "PING_STOP",
      meta: { toMain: true }
    }));

  // ANIMATION
  const pingAction$ = action$.filter(a => a.type === "PONG_AFTER");

  // const animationAction$ = pingAction$.map(a => ({
  //   type: "ANIMATION",
  //   payload: getScale(a.payload),
  //   meta: {
  //     toMain: true,
  //     ignoreSelf: true,
  //     delay: { pingCount: a.payload + 1 }
  //   }
  // }));

  const animationAction$ = pingAction$
    .map(a => a.payload)
    .filter(pingCount => pingCount === 1)
    .mapTo(delayedActions)
    .flatten();

  // NAME
  const nameSubmitAction$ = action$.filter(a => a.type === "NAME_SUBMIT");
  const nameFirebaseAction$ = nameSubmitAction$
    .map(a => a.payload)
    .map(firebaseActions.database.ref("name").set);

  const nameSink$ = sources.firebase.database.ref("name").value.map(v => {
    return {
      type: "NAME_SET",
      payload: v,
      meta: { toMain: true }
    };
  });

  // ARTICLES
  const articlesAction$ = action$.filter(a => a.type === "ARTICLES_GET");
  const articlesData$ = sources.firebase.database
    .ref("articles")
    .value.map(a => objectPropsToArray(a));
  const articlesSink$ = xs
    .combine(articlesData$, articlesAction$)
    .map(arr => arr[0])
    .map(articles => ({
      type: "ARTICLES_SET",
      payload: articles,
      meta: { toMain: true }
    }));

  const actionSink$ = xs.merge(
    toggleSink$,
    nameSink$,
    articlesSink$,
    animationAction$
  );
  return {
    ACTION: actionSink$,
    firebase: xs.merge(nameFirebaseAction$)
  };
};

export default App;
