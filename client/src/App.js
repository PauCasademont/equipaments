import { useState } from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';
import { CONSUMPTION, PRICE, AREA} from './constants/chart';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map />}
        />
        <Route
          path="/consumption/:id" exact
          render={() => <Chart dataType={CONSUMPTION} />}
        />
        <Route
          path="/price/:id" exact
          render={() => <Chart dataType={PRICE} />}
        />
         <Route
          path="/area/:id" exact
          render={() => <Chart dataType={AREA} />}
        />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
