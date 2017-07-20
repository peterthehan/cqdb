import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { createFilterURL, } from '../util/createFilterURL';
import { filterItems, } from '../util/filterItems';
import { imagePath, } from '../util/imagePath';
import { initializeFilters, } from '../util/initializeFilters';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')
  .character_visual
  .filter(i => i.type === 'HERO');

// for creating checkboxes
const checkboxes = {
  Star: ['1', '2', '3', '4', '5', '6',],
  Class: ['Warrior', 'Paladin', 'Archer', 'Hunter', 'Wizard', 'Priest',],
  Rarity: [
    'Legendary Hero',
    'Contract only Hero',
    'Promotion Hero',
    'Secret Hero',
    'Normal Hero',
    'Supply Hero',
  ],
  Faction: [
    'Grancia Empire',
    'Eastern Kingdom - Ryu',
    'Neth Empire',
    'Southwestern Alliance',
    'Eastern Kingdom - Han',
    'Roman Republic',
    'Heroes of Freedom',
    'Pumpkin City',
    'Order of the Goddess',
    'Supply all forces',
    'Unknown',
  ],
  Gender: ['Male', 'Female',],
};

export default class Heroes extends Component {
  state = {
    filters: {},
    items: [],
    render: [],
  }

  componentWillMount = () => {
    //console.log('Heroes', 'componentWillMount');
    const items = this.initializeItems();
    const filters = initializeFilters(checkboxes);
    const render = filterItems(items, filters);
    this.setState({ filters, items, render, });
  }

  componentDidMount = () => {
    //console.log('Heroes', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Heroes', 'componentWillReceiveProps');
    const filters = initializeFilters(checkboxes);
    const render = filterItems(this.state.items, filters);
    this.setState({ filters, render, });
  }

  componentWillUpdate = () => {
    //console.log('Heroes', 'componentWillUpdate');
  }

  componentWillUnmount = () => {
    //console.log('Heroes', 'componentDidUnmount');
    //window.removeEventListener('scroll', this.handleScroll);
  }

  initializeItems = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const star = i.id.match(/_\d/)[0][1];
      const className = resolve(`TEXT_CLASS_${i.classid.substring(4)}`);
      const rarity = resolve(
        `TEXT_CONFIRM_SELL_${i.rarity === 'LEGENDARY' ? (i.isgachagolden ? 'IN_GACHA' : 'LAGENDARY') : i.rarity}_HERO`
      );
      const faction = !i.domain || ['CHEN', 'MINO', 'NOS',].includes(i.domain)
        ? 'Unknown' // remove unreleased domains
        : resolve(
            i.domain === 'NONEGROUP' ? `TEXT_CHAMP_DOMAIN_${i.domain}_NAME` : `TEXT_CHAMPION_DOMAIN_${i.domain}`
          );
      const gender = resolve(`TEXT_EXPLORE_TOOLTIP_GENDER_${i.gender}`);
      const image = i.face_tex;

      const filters = [star, className, rarity, faction, gender,];
      const listItem = (
        <LinkContainer key={i.id} to={`/cqdb/heroes/${name}&${filters.slice(0, 2).join('&')}`}>
          <ListGroupItem>
            <Media>
              <Grid fluid>
                <Row>
                  <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                    <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                      <img alt='' src={imagePath('cq-assets', `heroes/${image}.png`)} />
                    </Media.Left>
                  </Col>
                  <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                    <Media.Body>
                      <Media.Heading>{`${name} (${star}★)`}</Media.Heading>
                      <p>{filters.slice(1).join(' | ')}</p>
                    </Media.Body>
                  </Col>
                </Row>
              </Grid>
            </Media>
          </ListGroupItem>
        </LinkContainer>
      );

      return [filters, listItem,];
    });

    return processedData;
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: filterItems(this.state.items, filters),
    }, () => {
      window.history.replaceState('', '', `?${createFilterURL(this.state.filters)}`);
    });
  }

  renderCheckbox = (key, value) => {
    const isChecked = this.state.filters[key][value];
    return (
      <Checkbox defaultChecked={isChecked} inline key={`${value}${isChecked}`} name={`${key}&${value}`} onChange={this.handleCheckbox}>
        {value}
      </Checkbox>
    );
  }

  renderCheckboxes = () => {
    return (
      Object.keys(checkboxes).map(i => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} lg={1} md={2} sm={2} xs={12}>{i}</Col>
          <Col lg={11} md={10} sm={10} xs={12}>
            {checkboxes[i].map(j => this.renderCheckbox(i, j))}
          </Col>
        </FormGroup> 
      ))
    );
  }

  // handleScroll = () => {
  //   if (!this.test) return;
  //   const [start, end] = this.test.getVisibleRange();
  //   console.log('visible', start);
  // }

  render = () => {
    //console.log('Heroes', 'render');
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>{this.renderCheckboxes()}</Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Heroes (${this.state.render.length})`}>
            <ListGroup fill>
              <ReactList
                itemRenderer={i => this.state.render[i]}
                length={this.state.render.length}
                minSize={parseInt(this.state.items.length / 8, 10)}
              />
            </ListGroup>
          </Panel>
        </Col>
      </Row>
    );
  }
}
