import { useState } from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map />}
        />
        <Route
          path="/chart/:id" exact
          render={() => <Chart />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
