import React, { Component, } from 'react';
import {
  Col,
  Grid,
  ListGroupItem,
  Media,
  Row,
} from 'react-bootstrap';

import { renderResults, } from '../components/renderResults';
import { renderTextArea, } from '../components/renderTextArea';
import { filterByText, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
import { parseURL, updateURL, } from '../util/url';

const heroData = require('../Decrypted/filtered_character_visual.json');
const skinData = require('../Decrypted/filtered_costume.json');
const interactionData = require('../Decrypted/get_hero_easteregg.json').heroeasteregg;

const data = interactionData.map(i => {
  const dialogues = [];

  for (let j of Object.keys(i.eatereggherotext)) {
    let d;

    if (j.startsWith('CHA')) {
      const hero = heroData[heroData.findIndex(k => k.id === j)];
      d = {
        name: resolve(hero.name),
        dialogue: resolve(i.eatereggherotext[j]),
        image: imagePath('cq-assets', `heroes/${hero.face_tex}.png`),
      };
    } else {
      const hero = skinData[skinData.findIndex(k => k.costume_name === `TEXT_${j}${k.costume_name.endsWith('_NAME') ? '_NAME' : ''}`)];
      d = {
        name: resolve(hero.costume_name),
        dialogue: resolve(i.eatereggherotext[j]),
        image: imagePath('cq-assets', `skins/${hero.face_tex}.png`),
      };
    }

    dialogues.push(d);
  }

  return {
    dialogues: dialogues,
    name: dialogues.map(j => j.name).join(' '),
  };
});

// console.log(data);

export default class Interactions extends Component {
  state = {
    textFilter: '',
    render: [],
  }

  componentWillMount = () => {
    this.timer = null;
    const [textFilter,] = parseURL({});
    const processed = filterByText(data, textFilter);
    const render = processed.map(this.renderListGroupItem);

    this.setState({textFilter, render,});
  }

  componentWillReceiveProps = () => {
    this.componentWillMount();
  }

  renderListGroupItem = (interactions, index) => {
    return (
      <ListGroupItem key={index}>
        <Media>
          <Grid fluid>
            {interactions.dialogues.map(this.renderItem)}
          </Grid>
        </Media>
      </ListGroupItem>
    );
  }

  renderItem = (interaction, index) => {
    return (
      <Row key={index}>
        <Col style={{padding: 0,}} lg={3} md={3} sm={4} xs={5}>
          <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
            <img alt='' src={interaction.image} />
          </Media.Left>
        </Col>
        <Col style={{padding: 0,}} lg={9} md={9} sm={8} xs={7}>
          <Media.Body>
            <Media.Heading>{interaction.name}</Media.Heading>
            <p>{interaction.dialogue}</p>
          </Media.Body>
        </Col>
      </Row>
    );
  }

  update = () => {
    updateURL(this.state.textFilter, {});
    const processed = filterByText(data, this.state.textFilter);

    this.setState({ render: processed.map(this.renderListGroupItem), });
  }

  handleTextChange = (e) => {
    if (e.target.value.includes('\n')) { return; }

    clearTimeout(this.timer);
    this.setState({ textFilter: e.target.value, }, () => {
      this.timer = setTimeout(() => this.update(), 300);
    });
  }

  render = () => {
    return (
      <Row>
        {renderTextArea(this.handleTextChange, this.state.textFilter, [12, 12, 12, 12])}
        {renderResults('Interactions', this.state.render)}
      </Row>
    );
  }
}
