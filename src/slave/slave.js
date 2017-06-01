import { run } from "@cycle/run";
import main from "./main";
import { makeFirebaseDriver } from "@joshforisha/cycle-firebase";
import { firebaseConfig } from "./firebaseConfig";
import { store, makeActionDriver, makeStateDriver } from "./store";

const drivers = {
  firebase: makeFirebaseDriver(firebaseConfig),
  ACTION: makeActionDriver(),
  STATE: makeStateDriver()
};

run(main, drivers);
