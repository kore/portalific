import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import App from './App'
import './styles/global.css'
import './styles/composition.css'
import './styles/utilities.css'
import './styles/blocks.css'
import './styles/exceptions.css'
import './styles/print.css'

createRoot(document.getElementById('root')).render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
)
