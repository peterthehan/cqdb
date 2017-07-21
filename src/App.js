import React, { Component, } from 'react';
import { Route, Router, Switch, } from 'react-router-dom';

import Frame from './components/Frame';
import Home from './pages/Home';
import Heroes from './pages/Heroes';
import HeroInformation from './pages/HeroInformation';
import Goddesses from './pages/Goddesses';
import Bread from './pages/Bread';
import Berries from './pages/Berries';
import Contracts from './pages/Contracts';
import Forging from './pages/Forging';
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
              <Route exact path='/cqdb/heroes:filters?' component={Heroes} />
              <Route exact path='/cqdb/heroes/:hero' component={HeroInformation} />
              <Route exact path='/cqdb/goddesses' component={Goddesses} />
              <Route exact path='/cqdb/bread:filters?' component={Bread} />
              <Route exact path='/cqdb/berries:filters?' component={Berries} />
              <Route exact path='/cqdb/premium contracts' component={Contracts} />
              <Route exact path='/cqdb/weapon forging' component={Forging} />
              <Route exact path='/cqdb/about' component={About} />
              <Route component={NoMatch} />
            </Switch>
          </Frame>
        )} />
      </Router>
    );
  }
}
