import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { deckApi } from '@/api/deckApi'

export function renderWithProviders(ui: ReactElement) {
  return render(<ApiProvider api={deckApi}>{ui}</ApiProvider>)
}
