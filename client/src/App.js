import { useState } from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';
import AddFacilityHeader from './components/Map/AddFacilityHeader/AddFacilityHeader';
import Edit from './components/Edit/Edit';
import Auth from './components/Auth/Auth';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map/>}
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
          render={() => <Chart/>}
        />
        <Route 
          path="/edit/:facilityId"
          render={() => <Edit/>}
        /> 
        <Route 
          path="/admin" exact
          render={() => <Auth/>}
        />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
