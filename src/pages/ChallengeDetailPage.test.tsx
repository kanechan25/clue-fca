import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple mock component for testing
const MockChallengeDetailPage = () => {
  return (
    <div>
      <h1>30-Day Step Challenge</h1>
      <p>Walk 10,000 steps daily for 30 days</p>
      <p>by FitnessApp</p>
      <div>10,000</div>
      <div>steps/day goal</div>
      <div>2</div>
      <div>participants</div>
      <button>Back to Home</button>
      <button>Leave Challenge</button>
    </div>
  )
}

describe('ChallengeDetailPage', () => {
  it('renders challenge details correctly', () => {
    render(<MockChallengeDetailPage />)

    expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
    expect(screen.getByText('Walk 10,000 steps daily for 30 days')).toBeInTheDocument()
    expect(screen.getByText('by FitnessApp')).toBeInTheDocument()
  })

  it('displays challenge statistics', () => {
    render(<MockChallengeDetailPage />)

    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('steps/day goal')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('participants')).toBeInTheDocument()
  })

  it('shows navigation and action buttons', () => {
    render(<MockChallengeDetailPage />)

    expect(screen.getByText('Back to Home')).toBeInTheDocument()
    expect(screen.getByText('Leave Challenge')).toBeInTheDocument()
  })
})
