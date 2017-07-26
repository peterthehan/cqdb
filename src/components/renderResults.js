import React from 'react';
import ReactList from 'react-list';
import {
  ListGroup,
  Panel,
} from 'react-bootstrap';

export function renderResults(title, render) {
  return (
    <Panel collapsible defaultExpanded header={`${title} (${render.length})`}>
      <ListGroup fill style={{maxHeight: '65vh', overflow: 'auto',}}>
        <ReactList
          itemRenderer={i => render[i]}
          length={render.length}
          minSize={10}
        />
      </ListGroup>
    </Panel>
  );
}