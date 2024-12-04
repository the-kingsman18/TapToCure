import Chatbot from './ChatBot'
import { mount } from 'cypress/react18'

describe('<Chatbot />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<Chatbot />)
  })
})