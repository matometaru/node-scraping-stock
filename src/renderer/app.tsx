import * as React from "react";
import { render } from "react-dom";
import { Router, Route, hashHistory } from "react-router";
// import sideNav from "./components/sideNav";
import Download from "./Download";
import Coin from "./Coin";
import Setting from "./Setting";
import Layout from "./layouts/Layout";

// Routingの定義
const appRouting = (
  <Router history={hashHistory}>
    <Route path="/coin" component={Coin} />
    <Route path="/" component={Layout}>
      <Route path="/download" component={Download} />
      <Route path="/upload" component={Coin} />
      <Route path="/setting" component={Setting} />
    </Route>
  </Router>
);

// Routingの初期化
if (!location.hash.length) {
  location.hash = "#/coin";
}

// Applicationをrendering
render(appRouting, document.getElementById("app"));
