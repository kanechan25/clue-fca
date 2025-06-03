import { CircularProgressProps } from '@/types'
import { motion } from 'framer-motion'

export const CircularProgress = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = '#3B82F6',
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className='relative'>
      <svg width={size} height={size} className='transform -rotate-90'>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke='#E5E7EB' strokeWidth={strokeWidth} fill='transparent' />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='transparent'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-sm font-semibold text-gray-700'>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
