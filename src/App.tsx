import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { RouterProvider } from 'react-router-dom'
import { deckApi } from './api/deckApi'
import { router } from './router'
import { Toaster } from './components/ui/sonner'

export default function App() {
  return (
    <ApiProvider api={deckApi}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ApiProvider>
  )
}
