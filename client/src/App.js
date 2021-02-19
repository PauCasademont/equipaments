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
          path="/chart" exact
          render={() => <Chart />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
