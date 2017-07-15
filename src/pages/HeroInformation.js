import React, { Component, } from 'react';
import { Panel, } from 'react-bootstrap';

import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')['character_visual'].filter(i => i.type === 'HERO');

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