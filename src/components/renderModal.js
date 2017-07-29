import React from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';

export function renderModal(handleButton, showModal, title, render) {
  return (
    <Modal show={showModal} onHide={handleButton}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {render}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleButton}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}