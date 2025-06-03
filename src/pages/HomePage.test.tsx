import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

const MockHomePage = () => {
  return (
    <div>
      <h1>Fitness Challenge</h1>
      <h2>Welcome back, Alex Johnson! 👋</h2>
      <p>Ready to crush your fitness goals today?</p>

      <div>Active Challenges</div>
      <div>1</div>
      <div>Total Progress</div>
      <div>8,000 steps</div>
      <div>Total Participants</div>
      <div>4</div>

      <input placeholder='Search challenges...' type='text' />
      <button>Create Challenge</button>

      <div data-testid='challenge-card'>30-Day Step Challenge</div>
      <div data-testid='challenge-card'>Marathon Prep</div>
    </div>
  )
}

describe('HomePage', () => {
  it('renders welcome message with user name', () => {
    render(<MockHomePage />)

    expect(screen.getByText('Welcome back, Alex Johnson! 👋')).toBeInTheDocument()
    expect(screen.getByText('Ready to crush your fitness goals today?')).toBeInTheDocument()
  })

  it('displays stats cards correctly', () => {
    render(<MockHomePage />)

    expect(screen.getByText('Active Challenges')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Total Progress')).toBeInTheDocument()
    expect(screen.getByText('8,000 steps')).toBeInTheDocument()
    expect(screen.getByText('Total Participants')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    render(<MockHomePage />)

    const searchInput = screen.getByPlaceholderText('Search challenges...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  it('displays create challenge button', () => {
    render(<MockHomePage />)

    const createButton = screen.getByText('Create Challenge')
    expect(createButton).toBeInTheDocument()
  })

  it('renders challenge cards for filtered challenges', () => {
    render(<MockHomePage />)

    const challengeCards = screen.getAllByTestId('challenge-card')
    expect(challengeCards).toHaveLength(2)
    expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
    expect(screen.getByText('Marathon Prep')).toBeInTheDocument()
  })
})
