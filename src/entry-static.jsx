import { StrictMode } from 'react'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

/*
 * Build-time entry for prerendering the landing route. Must NOT import
 * main.jsx — that module touches document at top level (font refresh,
 * magnetic cursor) and calls createRoot. Styles ride the client bundle;
 * only markup renders here.
 */
export default function Static({ url }) {
  return (
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}
