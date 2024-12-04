import { mount } from 'cypress/react18'
import Chatbot from './ChatBot'

describe('<Chatbot />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<Chatbot />)
  })
})