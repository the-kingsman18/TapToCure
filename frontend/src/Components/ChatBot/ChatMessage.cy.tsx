import ChatMessage from './ChatMessage'
import { mount } from 'cypress/react18'

describe('<ChatMessage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<ChatMessage message={''} />)
  })
})