import React from 'react';
import ReactList from 'react-list';
import {
  Col,
  ListGroup,
  Panel,
} from 'react-bootstrap';

export function renderResults(title, render) {
  return (
    <Col lg={12} md={12} sm={12} xs={12}>
      <Panel style={{marginTop: 20,}} collapsible defaultExpanded header={`${title} (${render.length})`}>
        <ListGroup fill style={{maxHeight: '100vh', overflow: 'auto',}}>
          <ReactList
            itemRenderer={i => render[i]}
            length={render.length}
            minSize={10}
          />
        </ListGroup>
      </Panel>
    </Col>
  );
}