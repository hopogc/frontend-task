import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { RouterProvider } from 'react-router-dom'
import { deckApi } from './api/deckApi'
import { router } from './router'

export default function App() {
  return (
    <ApiProvider api={deckApi}>
      <RouterProvider router={router} />
    </ApiProvider>
  )
}
