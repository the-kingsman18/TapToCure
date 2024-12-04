import { mount } from 'cypress/react18'
import ChatbotIcon from './ChatbotIcon'

describe('<ChatbotIcon />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<ChatbotIcon onClick={function (): void {
      throw new Error('Function not implemented.')
    } } />)
  })
})