import React from 'react';
import {
  Col,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';

export function renderTextArea(handleTextChange, textFilter) {
  return (
    <Col lg={8} md={6} sm={12} xs={12}>
      <FormGroup style={{marginBottom: 5,}}>
        <InputGroup>
          <FormControl
            onChange={handleTextChange}
            placeholder='Name'
            type='text'
            value={textFilter}
          />
          <InputGroup.Addon>
            <Glyphicon glyph='search' />
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    </Col>
  );
}