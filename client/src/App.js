import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
