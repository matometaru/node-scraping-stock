import * as React from "react";
import { render } from "react-dom";
import { Router, Route, hashHistory } from "react-router";
// import sideNav from "./components/sideNav";
import Download from "./Download";

// Routingの定義
const appRouting = (
  <Router history={hashHistory}>
    <Route path="/">
      <Route path="download" component={Download} />
    </Route>
  </Router>
);

// Routingの初期化
if (!location.hash.length) {
  location.hash = "#/download";
}

// Applicationをrendering
render(appRouting, document.getElementById("app"));
