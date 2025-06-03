import { useFitnessStore } from '@/stores/fitnessStore'
import { Link, Share2, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'

export const Sharing = () => {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const shareDropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useFitnessStore()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setIsShareOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const shareUrl = `${window.location.href}?user=${user?.id}`
  const shareText = `Check out this fitness challenge! Join me and let's reach our goals together! 💪`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
    setIsShareOpen(false)
  }

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
    setIsShareOpen(false)
  }

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(url, '_blank')
    setIsShareOpen(false)
  }

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    setIsShareOpen(false)
  }

  const shareMenuItems = [
    {
      label: 'Share on Facebook',
      action: handleShareFacebook,
      className: 'text-blue-600 hover:bg-blue-50',
    },
    {
      label: 'Share on WhatsApp',
      action: handleShareWhatsApp,
      className: 'text-green-600 hover:bg-green-50',
    },
    {
      label: 'Share on X (Twitter)',
      action: handleShareX,
      className: 'text-gray-800 hover:bg-gray-50',
    },
    {
      icon: Link,
      label: 'Copy Link',
      action: handleCopyLink,
      className: 'text-gray-600 hover:bg-gray-50 border-t border-gray-100',
    },
  ]

  return (
    <div className='relative' ref={shareDropdownRef}>
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className='flex items-center space-x-1 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
      >
        <Share2 className='w-5 h-5' />
        <ChevronDown className={`w-4 h-4 transition-transform ${isShareOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Share Dropdown Menu */}
      <AnimatePresence>
        {isShareOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'
          >
            <div className='py-2'>
              {shareMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${item.className || 'text-gray-700'}`}
                >
                  {item?.icon && <item.icon className='w-4 h-4' />}
                  <span className='text-sm'>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
