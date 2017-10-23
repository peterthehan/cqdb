import React, { Component, } from 'react';
import {
  Col,
  ListGroup,
  ListGroupItem,
  Media,
  Pager,
  Panel,
  Row,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';
import { Redirect, } from 'react-router-dom';

import { calculateStat, } from '../util/calculateStat';
import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';

// const frivberryData = require('../Decrypted/frivolous_character_addstatmax.json');
// const frivHeroData = require('../Decrypted/frivolous_character_visual.json');
// const frivStatData = require('../Decrypted/frivolous_character_stat.json');

const berryData = require('../Decrypted/get_character_addstatmax.json').character_addstatmax
  // .concat(frivberryData);
const heroData = require('../Decrypted/filtered_character_visual.json')
  // .concat(frivHeroData);
const sbwData = require('../Decrypted/filtered_weapon_sbw.json');
const skinData = require('../Decrypted/filtered_costume.json');
const statData = require('../Decrypted/filtered_character_stat.json')
  // .concat(frivStatData);

export default class HeroInformation extends Component {
  state = {
    berry: {},
    hero: {},
    pager: [],
    render: [],
    skin: [],
    stat: {},
    weapon: [],
  }

  componentWillMount = () => {
    this.initializeData();
  }

  componentWillReceiveProps = () => {
    this.initializeData();
  }

  findTarget = () => {
    const target = window.location.pathname.split('/')[3].split('&');
    target[0] = decodeURIComponent(target[0]);
    return target;
  }

  findHero = (target, key) => {
    if (target.constructor === Array) {
      for (let i of heroData) {
        const name = resolve(i.name);
        const star = i.id.match(/_\d/)[0][1];
        const className = resolve('TEXT_CLASS_' + i.classid.substring(4));

        if ([name, star, className].every(j => target.indexOf(j) > -1)) {
          return i;
        }
      }
    } else {
      for (let i of heroData) {
        if (i[key] === target) {
          return i;
        }
      }
    }
    return null;
  }

  initializeData = () => {
    const target = this.findTarget();
    const hero = this.findHero(target);
    if (!hero) {
      this.setState({
        render: <Redirect to={`/cqdb/heroes/${target.join('&')}/404`} />,
      });

      return;
    }

    const skin = skinData.filter(i => i.wearable_charid.includes(hero.id));
    const stat = statData[statData.findIndex(i => i.id === hero.default_stat_id)];
    const berry = stat.grade === 6 && hero.id !== 'CHA_WA_SUPPORT_6_1'
      ? berryData[berryData.findIndex(i => i.id === stat.addstat_max_id)]
      : {};
    const weapon = [6, 5, 4]
      .filter(i => i <= stat.grade)
      .map(i => {
        return sbwData
          .filter(j => parseInt(j.grade, 10) === i && j.reqhero.includes(hero.id))[0];
      })
      .filter(i => i);

    const prevHero = this.findHero(hero.id, 'upgradetargethero');
    const nextHero = !hero.upgradetargethero ? null : this.findHero(hero.upgradetargethero, 'id');
    
    const pager = [];
    if (prevHero) {
      const name = resolve(prevHero.name);
      const star = prevHero.id.match(/_\d/)[0][1];
      const className = resolve('TEXT_CLASS_' + prevHero.classid.substring(4));
      const image = prevHero.face_tex;

      pager.push([name, star, className, image,]);
    }
    if (nextHero) {
      const name = resolve(nextHero.name);
      const star = nextHero.id.match(/_\d/)[0][1];
      const className = resolve('TEXT_CLASS_' + nextHero.classid.substring(4));
      const image = nextHero.face_tex;

      pager.push([name, star, className, image,]);
    }

    this.setState({berry, hero, pager, skin, stat, weapon,},
      () => this.renderInformation()
    );
  }

  renderInformation = () => {
    const render = (
      <div>
        <Row>
          <Col md={12} sm={12} xs={12}>
            {this.renderGeneral()}
            {this.renderPagers()}
            {this.renderStatsTable()}
          </Col>
        </Row>
        <Row>
          {this.renderBlock()}
          {this.renderSbws()}
        </Row>
        <Row>
          {this.renderSkins()}
          {this.renderPortrait()}
        </Row>
      </div>
    );

    this.setState({render});
  }

  renderGeneral = () => {
    return (
      <Panel collapsible defaultExpanded header={`${resolve(this.state.hero.name)} (${this.state.stat.grade}★) `} key={`hero${this.findTarget().join('')}`}>
        <Media>
          <Media.Body>
            <p>{resolve(this.state.hero.desc)}</p>
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath(`heroes/${this.state.hero.face_tex}`)} />
          </Media.Right>
          <Row>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Class</Media.Heading>
              <p>{resolve('TEXT_CLASS_' + this.state.hero.classid.substring(4))}</p>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Rarity</Media.Heading>
              <p>
                {
                  resolve(
                    'TEXT_CONFIRM_SELL_' +
                    (this.state.hero.rarity === 'LEGENDARY' 
                      ? this.state.hero.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
                      : this.state.hero.rarity
                    ) +
                    '_HERO'
                  )
                }
              </p>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Faction</Media.Heading>
              {
                ['CHEN',].includes(this.state.hero.domain) || !this.state.hero.domain
                ? 'Unknown' // remove unreleased domains
                : resolve(this.state.hero.domain === 'NONEGROUP'
                    ? 'TEXT_CHAMP_DOMAIN_' + this.state.hero.domain + '_NAME'
                    : 'TEXT_CHAMPION_DOMAIN_' + this.state.hero.domain
                  )
              }
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Gender</Media.Heading>
              {resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + this.state.hero.gender)}
            </Col>
          </Row>
        </Media>
      </Panel>
    );
  }

  renderStats = (key, row) => {
    return (
      <tr key={key}>
        <td><b>{key}</b></td>
        {row.map((j, index) => <td key={index}>{j}</td>)}
      </tr>
    );
  }

  renderStatsTable = () => {
    const level = this.state.stat.grade * 10;
    const breadTraining = range(this.state.stat.grade).map(i => i - 1).reverse();

    // calculate bread training stats
    const s = this.state.stat;
    const calculated = breadTraining.map(i => {
      return [
        calculateStat(s.initialhp, s.growthhp, level, i),
        calculateStat(s.initialattdmg, s.growthattdmg, level, i),
        s.critprob,
        s.critpower,
        calculateStat(s.defense, s.growthdefense, level, i),
        calculateStat(s.resist, s.growthresist, level, i),
        s.hitrate,
        s.dodgerate,
      ];
    });

    // add stats + berry and just berry to calculated if it exists
    if (Object.keys(this.state.berry).length) {
      const b = this.state.berry;
      const berryTraining = [
        b.hp,
        b.attack_power,
        b.critical_chance,
        b.critical_damage,
        b.armor,
        b.resistance,
        b.accuracy,
        b.dodge,
      ];
      const berryCalculated = berryTraining.map((i, index) => {
        return calculated[0][index] + i;
      });

      calculated.unshift(berryTraining);
      calculated.unshift(berryCalculated);
      breadTraining.unshift('Berry');
      breadTraining.unshift('Max');
    }

    // match game's decimal places
    const rounding = [1, 1, 3, 2, 1, 1, 2, 2,];

    const keys = ['HP', 'Atk. Power', 'Crit.Chance', 'Crit.Damage', 'Armor', 'Resistance', 'Accuracy', 'Evasion',];

    // prep for dynamic row creation
    const table = {};
    keys.forEach((key, _) => {
      table[key] = calculated.map(i => i[_].toFixed(rounding[_]));
    });

    return (
      <Panel collapsible defaultExpanded header={`Stats (Lv. ${level})`} key={this.state.stat.grade}>
        <Table condensed hover responsive>
          <thead>
            <tr>
              <th></th>
              {breadTraining.map(i => <th key={i}>{`${!isNaN(i) ? '+' : ''}${i}`}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.keys(table).map(i => this.renderStats(i, table[i]))}
          </tbody>
        </Table>
      </Panel>
    );
  }

  renderBlock = () => {
    let passive = '';
    const skill_subname = resolve(this.state.stat.skill_subname);
    const skill_subdesc = resolve(this.state.stat.skill_subdesc);
    if (skill_subname && skill_subdesc) {
      // key does not resolve as-is, modification necessary
      passive = (
        <Row>
          <Col md={12} sm={12} xs={12}>
            <Media.Heading>
              {
                skill_subname + ' (' +
                resolve(
                  `TEXT_PASSIVE_SKILL_TOOLTIP_TYPE_${this.state.stat.hero_type}`
                ) + ')'
              }
            </Media.Heading>
            {skill_subdesc.replace(/@|#|\$/g, '')}
          </Col>
        </Row>
      );
    }

    const grade = [1, 1, 1, 2, 2, 3][this.state.stat.grade - 1];
    return (
      <Col md={6} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header='Block Skill' key={`grade${grade}`}>
          <Media>
            <Media.Body>
              <Media.Heading>
                {
                  resolve(this.state.stat.skill_name) +
                  ` (Lv. ${grade})`
                }
              </Media.Heading>
              <p>
                {resolve(this.state.stat.skill_desc).replace(/@|#|\$/g, '')}
              </p>
            </Media.Body>
            <Media.Right>
              <img alt='' src={imagePath(`blocks/${this.state.stat.skill_icon}`)} width={66} />
            </Media.Right>
            {passive}
          </Media>
        </Panel>
      </Col>
    );
  }

  renderSbw = (i, index) => {
    return (
      <Tab eventKey={index} key={i.grade} title={`${i.grade}★`}>
        <Media style={{paddingTop: 15,}}>
          <Media.Body>
            <Media.Heading>{resolve(i.name)}</Media.Heading>
            <p>{resolve(i.desc)}</p>
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath(`sbws/${i.image}`)} />
          </Media.Right>
          <Row>
            <Col md={6} sm={6} xs={6}>
              <Media.Heading>Category</Media.Heading>
              <p>{resolve('TEXT_WEAPON_CATE_' + i.categoryid.substring(4))}</p>
            </Col>
            <Col md={6} sm={6} xs={6}>
              <Media.Heading>Range</Media.Heading>
              <p>{i.range}</p>
            </Col>
            <Col md={6} sm={6} xs={6}>
              <Media.Heading>Atk. Power</Media.Heading>
              {i.attdmg}
            </Col>
            <Col md={6} sm={6} xs={6}>
              <Media.Heading>Atk. Speed</Media.Heading>
              {i.attspd}
            </Col>
          </Row>
        </Media>
      </Tab>
    );
  }

  renderSbws = () => {
    if (!this.state.weapon.length) { return; }
    
    return (
      <Col md={6} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header='Soulbound Weapon' key={this.state.weapon.length}>
          <Tabs defaultActiveKey={0} id="soulbound-weapon">
            {this.state.weapon.map(this.renderSbw)}
          </Tabs>
        </Panel>
      </Col>
    );
  }

  renderSkin = (i, index) => {
    // modify 'Type' value for display
    const convert = {
      'AttackPower': 'Atk. Power',
      'CriticalDamage': 'Crit.Damage',
      'CriticalChance': 'Crit.Chance',
      'Dodge': 'Evasion',
      'All': 'Stats',
    };
    const stats = i.addstat_json.map(j => {
      const label = j.Type in convert ? convert[j.Type] : j.Type;
      const value = j.Value < 1 ? `${parseInt(j.Value * 100, 10)}%` : j.Value;
      return label + ': ' + value;
    });

    let rarity = '';
    if (i.rarity === 'HIDDEN') {
      rarity = ' (Hidden)';
    } else if (['CONTRACT', 'LIMITED',].includes(i.rarity)) {
      rarity = ' (Event)';
    }
    return (
      <ListGroupItem key={index}>
        <Media>
          <Media.Body>
            <Media.Heading>{`${resolve(i.costume_name)}${rarity}`}</Media.Heading>
            <p>{stats.join(', ')}</p>
            <Media.Heading>Sell</Media.Heading>
            {i.sell_price}
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath(`skins/${i.face_tex}`)} />
          </Media.Right>
        </Media>
      </ListGroupItem>
    );
  }

  renderSkins = () => {
    if (!this.state.skin.length) { return; }
    
    return (
      <Col md={6} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header={`Skins (${this.state.skin.length})`} key={`skin${this.state.skin.length}`}>
          <ListGroup fill>
            {this.state.skin.map(this.renderSkin)}
          </ListGroup>
        </Panel>
      </Col>
    );
  }

  renderPager = (pager) => {
    const img = pager.pop();
    return (
      <LinkContainer key={pager.join('')} style={{display: 'flex',}} to={`/cqdb/heroes/${pager.join('&')}`}>
        <Pager.Item>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end',}}>
            <Media>
              <img alt='' src={imagePath(`heroes/${img}`)} />
            </Media>
            <text>{`${pager[0]} (${pager[1]}★)`}</text>
          </div>
        </Pager.Item>
      </LinkContainer>
    );
  }

  renderPagers = () => {
    if (!this.state.pager.length) { return; }
    
    const pagers = this.state.pager.map(this.renderPager);
    pagers.splice(1, 0, '\xa0'); // non-breakable space
    return (
      <Pager key='pager' style={{display: 'flex', justifyContent: 'center', marginTop: 0,}}>
        {pagers}
      </Pager>
    );
  }

  renderPortrait = () => {
    if (!this.state.hero.portrait) { return; }

    return (
      <Col md={6} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header='Portrait' key={`portrait${this.state.hero.portrait}`}>
          <img alt='' src={imagePath(`portraits/${this.state.hero.portrait}`)} width='100%' />
        </Panel>
      </Col>
    );
  }

  render = () => {
    window.scrollTo(0, 0);
    return (
      <div>
        {this.state.render}
      </div>
    );
  }
}
