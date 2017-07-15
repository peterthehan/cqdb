import React, { Component } from 'react';
import { Panel, } from 'react-bootstrap';

export default class HeroInformation extends Component {
  componentWillMount = () => {
    console.log(window.location.pathname);
  }
  render = (props) => {
    return (
      <Panel>
        asdf
      </Panel>
    );
  }
}