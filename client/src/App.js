import { useState } from 'react';
import {BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';

function App() {
  const [selectedFacility, setSelectedFacility] = useState(null);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map setSelectedFacility={setSelectedFacility} />}
        />
        <Route
          path="/chart" exact
          render={() => <Chart selectedFacility={selectedFacility} />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
