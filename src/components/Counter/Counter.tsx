import { useCounterStore } from '@/provider/counterProvider'
import reactLogo from '@/assets/images/react.svg'
import viteLogo from '@/assets/images/vite.svg'
import Button from '@/components/Common/Button'

export const Counter = () => {
  const { count, incrementCount, decrementCount } = useCounterStore((state) => state)

  return (
    <>
      <div className='flex justify-center items-center'>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <div className='flex gap-4 justify-center items-center'>
          <Button onClick={incrementCount}>Increment</Button>
          <Button onClick={decrementCount}>Decrement</Button>
          <div>Count: {count}</div>
        </div>
        <h1 className='mt-4'>React 19 & TailwindCSS 4</h1>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  )
}
