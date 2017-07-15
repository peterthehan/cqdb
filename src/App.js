import React, { Component, } from 'react';
import { Route, Router, Switch, } from 'react-router-dom';

import Frame from './components/Frame';
import Home from './pages/Home';
import Heroes from './pages/Heroes';
import HeroInformation from './pages/HeroInformation';
import About from './pages/About';
import NoMatch from './pages/NoMatch';

import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Route path='' component={(props) => (
          <Frame>
            <Switch>
              <Route exact path='/cqdb' component={Home} />
              <Route exact path='/cqdb/heroes' component={Heroes} />
              <Route exact path='/cqdb/heroes/:hero' component={HeroInformation} />
              <Route exact path='/cqdb/about' component={About} />
              <Route component={NoMatch} />
            </Switch>
          </Frame>
        )} />
      </Router>
    );
  }
}
