/// <reference types="cypress" />

import RegisterForm from '../Accounts/Register/register';
import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

describe('RegisterForm Component', () => {
  beforeEach(() => {
    // Mount the component within a MemoryRouter to enable routing
    mount(
      <MemoryRouter>
        <ToastContainer />
        <RegisterForm />
      </MemoryRouter>
    );

    // Stub the network requests to simulate successful responses
    cy.intercept('POST', '**/requestOtp', {
      statusCode: 200,
      body: { success: true, message: 'OTP sent' },
    }).as('requestOtp');

    cy.intercept('POST', '**/verifyOtp', {
      statusCode: 200,
      body: true,
    }).as('verifyOtp');
  });

  it('should display the registration form', () => {
    cy.get('h2').contains('Create Account');
  });

  it('should validate form fields and display error messages when fields are empty', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Full name is required');
    cy.contains('Email is required');
    cy.contains('Password is required');
    cy.contains('Confirm password is required');
    cy.contains('Mobile number is required');
  });

  it('should display error for invalid email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email address');
  });

  // it('should send OTP when clicking on verify', () => {
  //   cy.get('input[name="email"]').type('test@example.com');
  //   cy.contains('Verify').click();

  //   cy.wait('@requestOtp').then((interception) => {
  //     expect(interception.response?.statusCode).to.eq(200);
  //   });
  //   cy.contains('Sending OTP to test@example.com');
  // });

  // it('should verify OTP', () => {
  //   cy.get('input[name="email"]').type('test@example.com');
  //   cy.contains('Verify').click();

  //   cy.get('input[name="otp"]').type('123456');
  //   cy.contains('Verify OTP').click();

  //   cy.wait('@verifyOtp');
  //   cy.contains('OTP matched!');
  // });

  // it('should allow submission when OTP is verified and all fields are valid', () => {
  //   // Fill in the registration form
  //   cy.get('input[name="userName"]').type('John Doe');
  //   cy.get('input[name="email"]').type('test@example.com');
  //   cy.get('input[name="password"]').type('Password1!');
  //   cy.get('input[name="confirmPassword"]').type('Password1!');
  //   cy.get('input[name="mobileNumber"]').type('1234567890');
  //   cy.get('select[name="gender"]').select('male');
  //   cy.get('input[name="role"][value="doctor"]').check();

  //   // Verify OTP
  //   cy.contains('Verify').click();
  //   cy.wait('@verifyOtp');
  //   cy.contains('OTP matched!');

  //   // Submit the form
  //   cy.get('button[type="submit"]').click();

  //   // Check that the form submission leads to the correct navigation (simulated navigation)
  //   cy.location('pathname', { timeout: 15000 }).should('include', '/doctorReg');
  // });

  // it('should navigate to login page when clicking "Already have an account? Login"', () => {
  //   cy.contains('Already have an account?').click();
  //   cy.location('pathname', { timeout: 15000 }).should('include', '/login');
  // });
});

