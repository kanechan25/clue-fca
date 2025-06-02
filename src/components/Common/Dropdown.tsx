interface DropdownProps {
  className?: string
}

const Dropdown = ({ className = '' }: DropdownProps) => {
  return (
    <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${className}`}>
      <svg className='h-4 w-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
      </svg>
    </div>
  )
}

export default Dropdown
