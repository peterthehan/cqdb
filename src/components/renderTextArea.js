import React from 'react';
import {
  Col,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

export function renderTextArea(handleTextChange, textFilter) {
  return (
    <Col lg={8} md={8} sm={12} xs={12}>
      <FormGroup style={{marginBottom: '5px',}}>
        <FormControl
          componentClass='textarea'
          onChange={handleTextChange}
          placeholder='Name'
          style={{height: '34px', resize: 'none',}}
          value={textFilter}
        />
      </FormGroup>
    </Col>
  );
}