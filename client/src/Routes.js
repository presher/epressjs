import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Edit from './containers/Edit'
import Insert from './containers/Insert'



export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
    </Route>
    <Route exact path="/edit/:id">
        <Edit />
    </Route>
    <Route exact path="/insert">
        <Insert />
    </Route>
    {/* Finally, catch all unmatched routes */}
    <Route>
        <NotFound />
    </Route>
    </Switch>
  );
}