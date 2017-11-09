import 'babel-polyfill';
import React, { Component, } from 'react';
import { Route, Router, Switch, } from 'react-router-dom';

import Frame from './components/Frame';
import Home from './pages/Home';
import Heroes from './pages/Heroes';
import HeroInformation from './pages/HeroInformation';
import Portraits from './pages/Portraits';
import Soulbound from './pages/Soulbound';
import Weapons from './pages/Weapons';
import Skills from './pages/Skills';
import Goddesses from './pages/Goddesses';
import Bread from './pages/Bread';
import Berries from './pages/Berries';
import Interactions from './pages/Interactions';
import Contracts from './pages/Contracts';
import Forging from './pages/Forging';
import AttackOptimizer from './pages/AttackOptimizer';
import Links from './pages/Links';
import About from './pages/About';
import NoMatch from './pages/NoMatch';

import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

export default class App extends Component {
  renderRoute = (route, index) => {
    return (
      <Route component={route.component} exact key={index} path={`/cqdb${route.path}`} />
    );
  }

  render = () => {
    const routes = [
      { component: Home, path: '', },
      { component: Heroes, path: '/heroes', },
      { component: HeroInformation, path: '/heroes/:hero', },
      { component: Portraits, path: '/portraits', },
      { component: Soulbound, path: '/soulbound weapons', },
      { component: Weapons, path: '/weapons', },
      { component: Skills, path: '/skills', },
      { component: Goddesses, path: '/goddesses', },
      { component: Bread, path: '/bread', },
      { component: Berries, path: '/berries', },
      { component: Interactions, path: '/interactions', },
      { component: Contracts, path: '/contract pulling simulator', },
      { component: Forging, path: '/sbw forging simulator', },
      { component: AttackOptimizer, path: '/effective attack optimizer', },
      { component: Links, path: '/useful links', },
      { component: About, path: '/about', },
    ];

    return (
      <Router history={history}>
        <Frame>
          <Switch>
            {routes.map(this.renderRoute)}
            <Route component={NoMatch} />
          </Switch>
        </Frame>
      </Router>
    );
  }
}
