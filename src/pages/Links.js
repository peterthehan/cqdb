import React, { Component, } from 'react';
import {
  Col,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

const lists = {
  'Tier Lists': [
    {
      authors: ['Accurina',],
      title: 'Accurina\'s Inaccurate Tier List',
      link: 'https://goo.gl/bBgMTg',
      notes: '',
    },
    {
      authors: ['sakai4eva', 'Viress', 'jaetheho', 'kamakiller',],
      title: 'Hero/SBW/Skill IRC Tier List',
      link: 'https://goo.gl/oNQ2iF',
      notes: '',
    },
    {
      authors: ['TISTORY',],
      title: '크루세이더 퀘스트 용사등급표 + 추천조합표',
      link: 'https://goo.gl/nOC3NK',
      notes: 'In Korean.',
    },
    {
      authors: ['INVEN',],
      title: 'INVEN表翻訳',
      link: 'https://goo.gl/k5PlhB',
      notes: 'In Japanese.',
    },
  ],
  'Champions': [
    {
      authors: ['Vyrlokar',],
      title: 'Vyrlokar\'s Ultimate Guide to the CQ Champions',
      link: 'https://goo.gl/M37qRm',
      notes: 'Missing the champion Noa.',
    },
  ],
  'Legend of Primal Flames': [
    {
      authors: ['Nyaa',],
      title: 'Crusaders Quest Oda Guide',
      link: 'https://goo.gl/iqppI0',
      notes: '',
    },
    {
      authors: ['Shintouyu',],
      title: 'Legend Of Primal Flames Guide',
      link: 'https://goo.gl/4i8nCb',
      notes: '',
    },
    {
      authors: ['Schxion',],
      title: 'Legend of Primal Flames Map',
      link: 'https://goo.gl/YtlDQH',
      notes: '',
    },
  ],
  'Manacar': [
    {
      authors: ['kamakiller',],
      title: 'Manacar Rage, Ruin, Void, and End',
      link: 'https://goo.gl/PbpKdG',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Manacar WB Walkthrough',
      link: 'https://goo.gl/aJ8Yoy',
      notes: '',
    },
  ],
  'How to get': [
    {
      authors: ['/u/CalvinCopyright', 'kamakiller',],
      title: 'CQ Monuments and How To Get Them',
      link: 'https://goo.gl/e10jeA',
      notes: '',
    },
    {
      authors: ['Blargel',],
      title: 'Guide to unlocking "secret" FoS10',
      link: 'https://goo.gl/9BXBkD',
      notes: 'Lionel skin.',
    },
    {
      authors: ['Blargel',],
      title: 'Dark Himiko Skin',
      link: 'https://goo.gl/5yDbjr',
      notes: '',
    },
  ],
  'Miscellaneous': [
    {
      authors: ['/u/Cyloz',],
      title: 'CQ Hero Illustrations',
      link: 'https://goo.gl/06hnsT',
      notes: 'Missing post-KOF illustrations.',
    },
    {
      authors: ['Peter',],
      title: 'cq-assets',
      link: 'https://goo.gl/UzKBsq',
      notes: 'Up-to-date collection of all the sprite assets used in both cqdb and Fergus.',
    },
    {
      authors: ['Peter',],
      title: 'block-map',
      link: 'https://goo.gl/wkYdqt',
      notes: '',
    },
  ],
  'Beginner\'s Guide Comics': [
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 1',
      link: 'https://goo.gl/JpOluL',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 2',
      link: 'https://goo.gl/VH83O2',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 3',
      link: 'https://goo.gl/OEKdP6',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 4',
      link: 'https://goo.gl/T1d729',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 5',
      link: 'https://goo.gl/EikwMq',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 6',
      link: 'https://goo.gl/rkXgXC',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 7',
      link: 'https://goo.gl/fsTsgl',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Hasla Guide Vol. 8',
      link: 'https://goo.gl/1dDcVR',
      notes: '',
    },
    {
      authors: ['Crusaders Quest',],
      title: 'Berry System',
      link: 'https://goo.gl/jbgmLa',
      notes: '',
    },
  ],
};

export default class Links extends Component {
  renderListItem = (item, index) => {
    return (
      <ListGroupItem href={item.link} key={index}>
        <Media.Heading>{item.title}</Media.Heading>
        <p>{item.authors.join(', ')}</p>
        {!item.notes ? '' : <p>{item.notes}</p>}
      </ListGroupItem>
    );
  }

  renderList = (list) => {
    return (
      <Col key={list} lg={6} md={6} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header={list}>
          <ListGroup fill>
            {lists[list].map(this.renderListItem)}
          </ListGroup>
        </Panel>
      </Col>
    );
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel>
            The following list is a selection of hand-curated guides
            made by members of the Crusaders Quest community that are
            useful and mostly up-to-date.
          </Panel>
        </Col>
        {Object.keys(lists).map(this.renderList)}
      </Row>
    );
  }
}