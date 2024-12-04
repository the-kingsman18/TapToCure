import ChatInput from './ChatInput'
import { mount } from 'cypress/react18'

describe('<ChatInput />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<ChatInput onSend={function (message: string): void {
      throw new Error('Function not implemented.'+message)
    } } />)
  })
})