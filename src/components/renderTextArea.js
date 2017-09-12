import React from 'react';
import {
  Col,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';

export function renderTextArea(handleTextChange, textFilter, size = [8, 6, 12, 12,]) {
  return (
    <Col lg={size[0]} md={size[1]} sm={size[2]} xs={size[3]}>
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