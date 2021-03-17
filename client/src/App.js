import { useState } from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';
import AddFacilityHeader from './components/Map/AddFacilityHeader/AddFacilityHeader';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map />}
        />
        <Route
          path="/map/add_facility/:dataType" exact
          render={(props) => 
            <>
              <AddFacilityHeader />
              <Map ids={props.location.state.ids}/>
            </>
          }
        />
        <Route
          path="/chart/:dataType/:ids" exact
          render={() => <Chart />}
        />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
