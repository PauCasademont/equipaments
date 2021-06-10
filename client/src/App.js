import {BrowserRouter, Switch, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import Chart from './components/Chart/Chart';
import AddFacilityHeader from './components/Map/AddFacilityHeader/AddFacilityHeader';
import Edit from './components/Edit/Edit';
import Auth from './components/Auth/Auth';
import ChangePassword from './components/Auth/ChangePassword'
import InvisibleFacilities from './components/Admin/InvisibleFacilities/InvisibleFacilities';
import AdminUsersMenu from './components/Admin/AdminUsersMenu/AdminUsersMenu';
import AdminFacilitiesMenu from './components/Admin/AdminFacilitiesMenu/AdminFacilitiesMenu';

function App() {
//Root component. Return the page according to the current url

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
              <Map 
                ids={props.location.state.facilitiesIds} 
                displayedDatasets={props.location.state.displayedDatasets}
              />
            </>
          }
        />
        <Route
          path="/chart/:dataType/:ids" exact
          render={(props) => 
            <Chart 
              displayedDatasets={props.location.state?.displayedDatasets} 
            />
          }
        />
        <Route 
          path="/edit/:facilityId"
          render={() => <Edit/>}
        /> 
        <Route 
          path="/admin" exact
          render={() => <Auth/>}
        />
        <Route
          path='/password' exact
          render={() => <ChangePassword/>}
        />
        <Route
          path="/invisible_facilities" exact
          render={() => <InvisibleFacilities/>}
        />
        <Route
          path="/users_settings" exact
          render={() => <AdminUsersMenu/>}
        />
        <Route
          path="/facilities_settings" exact
          render={() => <AdminFacilitiesMenu/>}
        />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
