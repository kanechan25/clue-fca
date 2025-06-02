import { Unit, type Challenge, type UserProgress } from '@/types'

export const formatNumberDecimal = (num: number | string, decimals = 2) => {
  if (Number.isNaN(num)) {
    return 0
  }
  const parsedNum = parseFloat(String(num))

  if (parsedNum < 1) {
    return parseFloat(parsedNum.toFixed(8)) // Return the original number for values less than 0
  }

  if (Number(num) < 1000) {
    const number = parseFloat(Number(num).toFixed(decimals))
    return number
  } else {
    const number = parseFloat(Number(num).toFixed(decimals))
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const formatProgressWithUnit = (userProgress: Record<string, UserProgress>, challenges: Challenge[]) => {
  const progressEntries = Object.values(userProgress)
    .map((progress) => {
      const challenge = challenges.find((c) => c.id === progress.challengeId)
      if (!challenge) return null

      let formattedValue: string | number = 0
      switch (challenge.unit) {
        case Unit.STEPS:
          formattedValue = formatNumberDecimal(progress.totalProgress, 0)
          break
        case Unit.MILES:
          formattedValue = formatNumberDecimal(progress.totalProgress, 1)
          break
        case Unit.CALORIES:
          formattedValue = formatNumberDecimal(progress.totalProgress, 0)
          break
        case Unit.POUNDS:
          formattedValue = formatNumberDecimal(progress.totalProgress, 1)
          break
        default:
          formattedValue = formatNumberDecimal(progress.totalProgress, 0)
      }

      return `${formattedValue} ${challenge.unit}`
    })
    .filter(Boolean) // Remove null entries

  return progressEntries
}
