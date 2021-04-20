import React from 'react'
import { HashRouter as Router,Switch,Route } from 'react-router-dom';
import './App.css';
import UserInfo from './Components/UserInfo/UserInfo'
import ControlCenter from './Components/ControlCenter/ControlCenter'


function App() {
  return (
    <Router>

    <div>
      {/* <UserInfo /> */}
      <Switch>
          <Route path="/control">
            <ControlCenter />
          </Route>
          <Route path="/" >
          <UserInfo />
          </Route>
      </Switch>
    </div>

    </Router>
  );
}

export default App;
