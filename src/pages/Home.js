import React, { Component } from 'react';
import { Panel, } from 'react-bootstrap';

export default class Home extends Component {
  render = () => {
    return (
      <Panel>
        <p>
          Welcome to the database for all things <a href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>Crusaders Quest</a>!
          The site is currently a work-in-progress so apologies for the inconvenience. Feel free to report bugs or suggest features.
          You can contact me on: Discord: Miku#0039, Crusaders Quest: Saarja
        </p>
        <p>
          Made with ❤ by <a href='https://github.com/Johj'>Peter Han</a>.
        </p>
      </Panel>
    );
  }
}