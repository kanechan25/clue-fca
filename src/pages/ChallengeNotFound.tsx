import { useNavigate } from 'react-router-dom'

const ChallengeNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-4xl mb-4'>😕</div>
        <h2 className='text-xl font-semibold text-gray-600 mb-2'>Challenge Not Found</h2>
        <button onClick={() => navigate('/')} className='text-blue-500 hover:text-blue-600'>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default ChallengeNotFound
