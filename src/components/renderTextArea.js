import React from 'react';
import {
  FormControl,
  FormGroup,
} from 'react-bootstrap';

export function renderTextArea(handleTextChange, textFilter) {
  return (
    <FormGroup style={{marginBottom: '5px',}}>
      <FormControl
        componentClass='textarea'
        onChange={handleTextChange}
        placeholder='Name'
        style={{height: '34px', resize: 'none',}}
        value={textFilter}
      />
    </FormGroup>
  );
}