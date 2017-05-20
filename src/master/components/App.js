import React from "react";
import Ticker from "./Ticker";
import Name from "./Name";
import Articles from "./Articles";

const App = () => (
  <div>
    <div>
      <a href="https://github.com/vkammerer/webworker-redux">
        webworker-redux
      </a>
      <br />
      <br />
      An experiment with redux to test:
      <ul>
        <li>- the performance of web workers</li>
        <li>
          - a potential architecture with react in the main thread
          and cyclejs in the worker
        </li>
      </ul>
    </div>
    <Ticker />
    <Name />
    <Articles />
  </div>
);

export default App;
