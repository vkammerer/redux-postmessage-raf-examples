import React from "react";
import Circle from "./Circle";
import Name from "./Name";
import Articles from "./Articles";

const App = () => (
  <div>
    <div>
      <a href="https://github.com/vkammerer/redux-postmessage-raf-examples">
        redux-postmessage-raf-examples
      </a>
      <br />
      <br />
      Experiments with
      {" "}
      <a href="https://github.com/vkammerer/redux-postmessage-raf">
        @vkammerer/redux-postmessage-raf
      </a>
      .
    </div>
    <Circle />
    <Name />
    <Articles />
  </div>
);

export default App;
