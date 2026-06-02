import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import App from './App'
import './styles/globals.scss'
import './styles/theme-default.scss'
import './styles/theme-black.scss'
import './styles/theme-green.scss'

createRoot(document.getElementById('root')).render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
)
