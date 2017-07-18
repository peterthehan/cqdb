import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')
  .character_visual
  .filter(i => i.type === 'HERO');

// for creating checkboxes
const items = {
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
    'Supply all forces',
    'Unknown',
  ],
  Gender: ['Male', 'Female',],
};

export default class Heroes extends Component {
  state = {
    filters: {},
    heroes: [],
    render: [],
  }

  componentWillMount = () => {
    //console.log('Heroes', 'componentWillMount');
    const processedData = this.initializeHeroes();
    const filters = this.initializeFilters();
    const render = this.renderHeroes(processedData, filters);
    this.setState({
      filters: filters,
      heroes: processedData,
      render: render,
    });
  }

  componentDidMount = () => {
    //console.log('Heroes', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Heroes', 'componentWillReceiveProps');
    const filters = this.initializeFilters();
    const render = this.renderHeroes(this.state.heroes, filters);
    this.setState({
      filters: filters,
      render: render,
    });
  }

  componentWillUpdate = () => {
    //console.log('Heroes', 'componentWillUpdate');
  }

  componentWillUnmount = () => {
    //console.log('Heroes', 'componentDidUnmount');
    //window.removeEventListener('scroll', this.handleScroll);
  }

  initializeHeroes = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const star = i.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));
      const rarity = resolve(
        'TEXT_CONFIRM_SELL_' +
        (i.rarity === 'LEGENDARY' 
          ? i.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
          : i.rarity
        ) +
        '_HERO'
      );
      const faction = ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(i.domain) || !i.domain
        ? 'Unknown' // remove unreleased domains
        : resolve(i.domain === 'NONEGROUP'
            ? 'TEXT_CHAMP_DOMAIN_' + i.domain + '_NAME'
            : 'TEXT_CHAMPION_DOMAIN_' + i.domain
          );
      const gender = resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + i.gender);
      const image = i.face_tex;

      const filterItems = [name, star, clas, rarity, faction, gender, image,];
      const identifier = filterItems.slice(0, filterItems.length - 4);
      const heroListItem = (
        <LinkContainer key={identifier.join('')} to={`/cqdb/heroes/${identifier.join('&')}`}>
          <ListGroupItem>
            <Media>
              <Media.Left>
                <img alt='' src={imagePath('fergus', `assets/heroes/${filterItems[6]}.png`)} />
              </Media.Left>
              <Media.Body>
                <Media.Heading>{`${filterItems[0]} (${filterItems[1]}★)`}</Media.Heading>
                <p>{filterItems.slice(2, filterItems.length - 1).join(' | ')}</p>
              </Media.Body>
            </Media>
          </ListGroupItem>
        </LinkContainer>
      );

      return [filterItems, heroListItem];
    });

    return processedData;
  }

  initializeFilters = () => {
    // initialize each filter category key with a filter-false value
    const filters = {};
    Object.keys(items).forEach(i => {
      filters[i] = {};
      items[i].forEach(j => filters[i][j] = false);
    });

    // if url contains querystring, parse and error-check it
    if (window.location.search.length) {
      decodeURIComponent(window.location.search.substring(1)).split('&').forEach(i => {
        const kv = i.split('=');
        kv[1].split(',').forEach(j => {
          if (j in filters[kv[0]]) {
            filters[kv[0]][j] = true;
          }
        });
      });
    }

    return filters;
  }

  filterHeroes = (data, filters) => {
    let filtered = data;
    for (let i of Object.keys(filters)) {
      const currentFilters = Object.keys(filters[i]).filter(j => {
        return filters[i][j];
      });

      if (!currentFilters.length) {
        continue;
      }

      filtered = filtered
        .filter(([filterItems, _])=> filterItems.some(k => currentFilters.includes(k)));
    }

    return filtered.map(([_, heroListItem]) => heroListItem);
  }

  renderHeroes = (data, filters) => {
    const filtered = this.filterHeroes(data, filters);
    return filtered;
  }

  createFilterURL = () => {
    const params = [];
    for (let i of Object.keys(this.state.filters)) {
      const arr = Object.keys(this.state.filters[i]).filter(j => {
        return this.state.filters[i][j]
      })

      if (!arr.length) {
        continue;
      }

      params.push(`${i}=${arr.join(',')}`);
    }
    return params.join('&');
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: this.renderHeroes(this.state.heroes, filters),
    }, () => {
      window.history.pushState('', '', `?${this.createFilterURL()}`);
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
      Object.keys(items).map(i => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} lg={1} md={2} sm={2} xs={12}>{i}</Col>
          <Col lg={11} md={10} sm={10} xs={12}>
            {items[i].map(j => this.renderCheckbox(i, j))}
          </Col>
        </FormGroup> 
      ))
    );
  }

  // handleScroll = () => {
  //   if(this.test == null) return;
  //   const [start, end] = this.test.getVisibleRange();
  //   console.log('visible', start)
  // }

  renderHero = (index) => {
    return this.state.render[index];
  }

  render = () => {
    //console.log('Heroes', 'render');
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>{this.renderCheckboxes()}</Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Heroes (${this.state.render.length})`}>
            <ListGroup fill>
              <ReactList
                itemRenderer={this.renderHero}
                length={this.state.render.length}
                minSize={10}
              />
            </ListGroup>
          </Panel>
        </Col>
      </Row>
    );
  }
}
