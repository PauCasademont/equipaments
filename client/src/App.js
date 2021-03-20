import { useState } from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';
import AddFacilityHeader from './components/Map/AddFacilityHeader/AddFacilityHeader';
import Auth from './components/Auth/Auth';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/" exact
          render={() => <Map user={user}/>}
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
          render={() => <Chart user={user}/>}
        />
        <Route 
          path="/admin" exact
          render={() => <Auth setUser={setUser}/>}
        />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
