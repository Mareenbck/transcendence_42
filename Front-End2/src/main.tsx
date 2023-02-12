import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*
const elem = ReactDOM.createRoot(
  'div',
  {id: 'app' , className: 'container'},
  'Hello'
)

const root = document.getElementById('root')

ReactDOM.render(elem, root)
*/