import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MetricTile } from './MetricTile'

describe('MetricTile', () => {
  it('ties the value to its caption', () => {
    render(<MetricTile value="11" label="years in frontend" />)
    const group = screen.getByRole('group', { name: 'years in frontend' })
    expect(group).toHaveTextContent('11')
  })
})
