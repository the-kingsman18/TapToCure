import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './codemodel.css';

interface CodeModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (enteredCode: string) => void;
}

interface CodeModalState {
  enteredCode: string;
}

class CodeModal extends Component<CodeModalProps, CodeModalState> {
  constructor(props: CodeModalProps) {
    super(props);
    this.state = {
      enteredCode: '',
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ enteredCode: event.target.value });
  };

  handleSubmitCode = () => {
    const { handleSubmit } = this.props;
    const { enteredCode } = this.state;

    if (enteredCode.trim() !== '') {
      handleSubmit(enteredCode.trim());
      this.setState({ enteredCode: '' }); // Clear the code after submission
     
    }
  };

  handleCloseModal = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { show } = this.props;
    const { enteredCode } = this.state;

    return (
      <Modal show={show} onHide={this.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Access Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="adminCode">Enter Access Code</label>
            <input
              type="text"
              value={enteredCode}
              onChange={this.handleInputChange}
              className="form-control"
              placeholder="Enter the 4-digit code"
              autoFocus // Automatically focus on the input
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSubmitCode}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CodeModal;
