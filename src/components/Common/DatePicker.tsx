import { useRef } from 'react'
import { Calendar } from 'lucide-react'

interface DatePickerProps {
  label?: string
  value: string
  onChange: (date: string) => void
  min?: string
  max?: string
  required?: boolean
  className?: string
  placeholder?: string
}

export const DatePicker = ({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  className = '',
  placeholder,
}: DatePickerProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleDateClick = () => {
    const input = dateInputRef.current
    if (input) {
      try {
        if ('showPicker' in input && typeof (input as any).showPicker === 'function') {
          ;(input as any).showPicker()
        } else {
          input.focus()
          input.click()
        }
      } catch {
        input.focus()
      }
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          <Calendar className='w-4 h-4 inline mr-1' />
          {label}
        </label>
      )}
      <div className='relative flex'>
        <input
          type='date'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          className='flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors'
          required={required}
          ref={dateInputRef}
        />
        <button
          type='button'
          onClick={handleDateClick}
          className='px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
          title='Open calendar'
        >
          <Calendar className='w-4 h-4 text-gray-600' />
        </button>
      </div>
    </div>
  )
}
