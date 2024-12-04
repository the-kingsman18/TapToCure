import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css';
import {store,persistor} from "./Components/Store/MyStore"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

createRoot(document.getElementById('root')!).render(
  
   <Provider store={store}>
      
          <PersistGate loading={null} persistor={persistor}>

                
                <App />

          </PersistGate>

</Provider>
  
    
  
)
