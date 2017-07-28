import React, { Component, } from 'react';
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  Glyphicon,
  OverlayTrigger,
  Panel,
  Popover,
  Row,
  Table,
} from 'react-bootstrap';

import { calculateStat, } from '../util/calculateStat';
import { cartesian, combinationWithRepetition, } from '../util/combinatorics';
import { resolve, } from '../util/resolve';

const berryData = require('../Decrypted/get_character_addstatmax.json').character_addstatmax;
const heroData = require('../Decrypted/filtered_character_visual.json');
const sbwData = require('../Decrypted/filtered_weapon_sbw.json');
const skinData = require('../Decrypted/filtered_costume.json');
const statData = require('../Decrypted/filtered_character_stat.json');

const statLabels = [
  'HP',
  'Atk. Power',
  'Crit.Chance',
  'Crit.Damage',
  'Armor',
  'Resistance',
  'Accuracy',
  'Evasion',
];

// parse data files
const heroSelectData = heroData
  .filter(i => i.id.match(/_\d/)[0][1] === '6') // remove non-6 star heroes
  .map(hero => {
    // if -1, hero does not have an sbw
    const sbwIndex = sbwData.findIndex(i => i.grade === 6 && i.reqhero_ref === hero.id);
    if (sbwIndex === -1) {
      return null;
    }

    return {
      id: hero.id,
      image: hero.face_tex,
      name: resolve(hero.name),
      star: hero.id.match(/_\d/)[0][1],
      class: resolve(`TEXT_CLASS_${hero.classid.substring(4)}`),
    };
  })
  .filter(i => i); // remove null from the pool

//console.log(heroSelectData);

const ringMainOptions = {
  '230': 'Atk. Power',
  '0.081': 'Crit.Chance',
  '0.13': 'Crit.Chance',
  '0.345': 'Crit.Damage',
};

const weaponOptions = {
  '0.2875': 'Atk. Power',
  '0.20125': 'Crit.Chance',
  '0.8625': 'Crit.Damage',
};

export default class Optimizer extends Component {
  state = {
    heroIndex: 0,
    render: [],
  }

  findHero = () => {
    const hero = heroData[heroData.findIndex(i => i.id === heroSelectData[this.state.heroIndex].id)];

    // find hero's respective stat, berry, sbw, and skin data
    const stat = statData[statData.findIndex(i => i.id === hero.default_stat_id)];
    const berry = stat.grade === 6 && hero.id !== 'CHA_WA_SUPPORT_6_1'
      ? berryData[berryData.findIndex(i => i.id === stat.addstat_max_id)]
      : {};
    const sbw = {
      'Atk. Power': sbwData[sbwData.findIndex(i => i.grade === 6 && i.reqhero.includes(hero.id))].attdmg,
    };
    const skin = skinData.filter(i => i.wearable_charid.includes(hero.id));

    // find hero's metadata
    const image = hero.face_tex;
    const name = resolve(hero.name);
    const star = stat.grade.toString();
    const className = resolve(`TEXT_CLASS_${hero.classid.substring(4)}`);

    // find hero's base stats
    const level = stat.grade * 10;
    const breadTraining = [stat.grade - 1];

    const baseStats = {};
    breadTraining.forEach(i => {
      const calculatedStats = [
        calculateStat(stat.initialhp, stat.growthhp, level, i),
        calculateStat(stat.initialattdmg, stat.growthattdmg, level, i),
        stat.critprob,
        stat.critpower,
        calculateStat(stat.defense, stat.growthdefense, level, i),
        calculateStat(stat.resist, stat.growthresist, level, i),
        stat.hitrate,
        stat.dodgerate,
      ];

      statLabels.forEach((j, index) => baseStats[j] = calculatedStats[index]);
    });

    // find hero's berry stats
    const berryStats = {};
    if (Object.keys(berry).length) {
      const berries = [
        berry.hp,
        berry.attack_power,
        berry.critical_chance,
        berry.critical_damage,
        berry.armor,
        berry.resistance,
        berry.accuracy,
        berry.dodge,
      ];

      statLabels.forEach((i, index) => berryStats[i] = berries[index]);
    }

    const convert = {
      'AttackPower': 'Atk. Power',
      'CriticalDamage': 'Crit.Damage',
      'CriticalChance': 'Crit.Chance',
      'Dodge': 'Evasion',
      'All': 'Stats',
    };
    const skinProcessed = skin.map(i => {
      const skinStats = {};
      i.addstat_json.forEach(j => {
        const label = j.Type in convert ? convert[j.Type] : j.Type;
        skinStats[label] = j.Value;
      });

      return {
        image: i.face_tex,
        name: resolve(i.costume_name),
        stats: skinStats,
      };
    });

    return {
      image: image,
      name: name,
      star: star,
      class: className,
      baseStats: baseStats,
      berryStats: berryStats,
      sbw: sbw,
      skin: skinProcessed,
    };
  }

  calculateDamage = (hero) => {
    const weaponCombinations = [
      combinationWithRepetition(Object.keys(weaponOptions), 1),
      combinationWithRepetition(Object.keys(weaponOptions), 2),
    ];
    const carte = weaponCombinations.map(i => {
      return cartesian(i, Object.keys(ringMainOptions), !hero.skin.length ? [null] : hero.skin);
    });

    const calculated = carte.map(i => {
      return i.map(j => {
        // initialize stats
        const net = {
          'Atk. Power': 0,
          'Crit.Chance': 0,
          'Crit.Damage': 0,
        };

        // add base stats
        Object.keys(net).forEach(k => {
          net[k] += hero.baseStats[k];
        });

        // add weapon conversions
        // do this first because atk. power % conversion affects base stats
        const weapon = j[0];
        weapon.forEach(k => {
          if (weaponOptions[k] === 'Atk. Power') {
            net[weaponOptions[k]] *= (1 + parseFloat(k));
          } else {
            net[weaponOptions[k]] += parseFloat(k);
          }
        });

        // add ring stats
        const ring = j[1];
        net[ringMainOptions[ring]] += parseFloat(ring);

        // add berry stats
        Object.keys(net).forEach(k => {
          net[k] += hero.berryStats[k];
        });

        // add sbw stats
        net['Atk. Power'] += hero.sbw['Atk. Power'];

        // add skin stats
        const skin = j[2];
        if (skin) {
          Object.keys(skin.stats).forEach(k => {
            if (k in net) {
              net[k] += skin.stats[k];
            }
          });
        }

        const effectiveAtkPower = net['Atk. Power'] * (1 + net['Crit.Chance'] * net['Crit.Damage']);
        const weaponConversions = {};
        weapon.map(k => weaponConversions[weaponOptions[k]] = k);
        const ringOption = {};
        ringOption[ringMainOptions[ring]] = ring;

        return {
          net: net,
          effectiveAtkPower: effectiveAtkPower.toFixed(1),
          weapon: weapon,
          skin: skin,
          ring: ringOption,
        };
      }).sort((a, b) => b.effectiveAtkPower - a.effectiveAtkPower)
    });

    return calculated;
  }

  handleHeroSelect = (e) => {
    this.setState({ heroIndex: e.target.value, }, () => {
      const calculated = this.calculateDamage(this.findHero());
      const render = calculated.map(this.renderTable);

      this.setState({render,});
    });
  }

  renderRow = (result, index) => {
    const weaponValue = result.weapon.map(i => `${weaponOptions[i]}: ${(parseFloat(i) * 100).toFixed(3)}%`);
    const ringValue = parseFloat(Object.values(result.ring)) < 1
      ? `${(parseFloat(Object.values(result.ring)) * 100).toFixed(1)}%`
      : parseInt(Object.values(result.ring), 10);

    return (
      <tr key={index}>
        <td>
          <text>{`${weaponValue[0]}`}</text>
          {weaponValue.length > 1 ? <text><br />{weaponValue[1]}</text> : ''}
          <br />
          <text>{`${Object.keys(result.ring)}: ${ringValue}`}</text>
          {result.skin ? <text><br />{result.skin.name}</text> : ''}
        </td>
        <td>{result.effectiveAtkPower}</td>
        <td>{result.net['Atk. Power'].toFixed(1)}</td>
        <td>{`${(parseFloat(result.net['Crit.Chance']) * 100).toFixed(3)}%`}</td>
        <td>{result.net['Crit.Damage'].toFixed(4)}</td>
      </tr>
    );
  }

  renderTable = (calculated, index) => {
    return (
      <Panel collapsible defaultExpanded header={`Weapon Conversions: ${index + 1}`} key={index}>
        <Table condensed hover responsive>
          <thead>
            <tr>
              <th>Parameters</th>
              <th>eAtk. Power</th>
              <th>Atk. Power</th>
              <th>Crit.Chance</th>
              <th>Crit.Damage</th>
            </tr>
          </thead>
          <tbody>
            {calculated.map(this.renderRow)}
          </tbody>
        </Table>
      </Panel>
    );
  }

  renderOptions = (i, index) => {
    return (
      <option key={index} value={index}>
        {`${i.name} (${i.star}★)`}
      </option>
    );
  }

  render = () => {
    const popover = (
      <Popover id='info'>

        <p>
          This tool only considers attack power, critical chance, and critical damage in its calculations.
          It assumes the hero is max bread and berry trained and that the hero has their sbw equipped.
          As such, this tool is best used for heroes whose damage strictly scale off their attack power
          (i.e. Night Witch Teresa, Creator Benjamin, etc).
        </p>
        <p>
          This tool is not conclusive for "tricky" heroes whose damage scale off non-attack stats or complicated passive procs
          (i.e. Ocean King Koxinga, Berserk - V, Devil Bullet No. 9, etc).
        </p>
      </Popover>
    );

    const footer = (
      <OverlayTrigger overlay={popover} placement='bottom' rootClose trigger='click'>
        <Button bsStyle='link'>
          <Glyphicon glyph='info-sign' />
        </Button>
      </OverlayTrigger>
    );

    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel footer={footer}>
            <p>
              Effective Attack Optimizer computes every combination of weapon conversions, ring options, and skins to maximize 
              the selected hero's effective attack power.
            </p>
          </Panel>
          <FormGroup controlId="formControlsSelect">
            <FormControl componentClass="select" defaultValue='' onChange={this.handleHeroSelect}>
              {
                [<option disabled key='null' value=''>Select a hero</option>].concat(
                  heroSelectData.map((i, index) => this.renderOptions(i, index))
                )
              }
            </FormControl>
          </FormGroup>
          {this.state.render}
        </Col>
      </Row>
    );
  }
}