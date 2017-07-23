import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { filterItems, filterNames, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { initializeFilters, } from '../util/initializeFilters';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
import { updateURL, } from '../util/updateURL';
const data = require('../Decrypted/filtered_character_visual.json');

// for creating checkboxes
const checkboxes = {
  Star: range(6),
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
    nameFilter: '',
    render: [],
  }

  componentWillMount = () => {
    //console.log('Heroes', 'componentWillMount');
    const items = this.initializeItems();
    const [nameFilter, filters] = initializeFilters(checkboxes);
    const render = filterItems(filterNames(nameFilter, items), filters);
    this.setState({ filters, items, nameFilter, render, });
  }

  componentDidMount = () => {
    //console.log('Heroes', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Heroes', 'componentWillReceiveProps');
    const [nameFilter, filters] = initializeFilters(checkboxes);
    const render = filterItems(filterNames(nameFilter, this.state.items), filters);
    this.setState({ filters, nameFilter, render, });
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

      const filters = [name, star, className, rarity, faction, gender,];
      const listItem = (
        <LinkContainer key={i.id} to={`/cqdb/heroes/${filters.slice(0, 3).join('&')}`}>
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
                      <p>{filters.slice(2).join(' | ')}</p>
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

  handleChange = (e) => {
    if (e.target.value.includes('\n')) {
      return;
    }

    this.setState({
      nameFilter: e.target.value,
      render: filterItems(filterNames(e.target.value, this.state.items), this.state.filters),
    }, () => updateURL(this.state.nameFilter, this.state.filters));
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: filterItems(filterNames(this.state.nameFilter, this.state.items), filters),
    }, () => updateURL(this.state.nameFilter, this.state.filters));
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
          <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>{i}</Col>
          <Col lg={10} md={9} sm={8} xs={12}>
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

  // handleButton = (e) => {
  //   const filters = this.state.filters;
  //   Object.keys(filters).forEach(i => {
  //     Object.keys(filters[i]).forEach(j => {
  //       filters[i][j] = false;
  //     });
  //   });
  //   const nameFilter = '';

  //   this.setState({
  //     filters: filters,
  //     nameFilter: nameFilter,
  //     render: filterItems(filterNames(nameFilter, this.state.items), filters),
  //   }, () => window.history.replaceState('', '', '/cqdb/heroes'));
  // }

  render = () => {
    //console.log('Heroes', 'render');
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>Name</Col>
                <Col lg={10} md={9} sm={8} xs={12}>
                  <FormControl
                    componentClass='textarea'
                    onChange={this.handleChange}
                    style={{height: '34px', resize: 'none',}}
                    value={this.state.nameFilter}
                  />
                </Col>
              </FormGroup>
              {this.renderCheckboxes()}
            </Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Heroes (${this.state.render.length})`}>
            <ListGroup fill>
              <ReactList
                itemRenderer={i => this.state.render[i]}
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
