import { useState, useMemo } from 'react'
import { Challenge, ChallengeType } from '@/types'

// Types for filtering options
type FilterType = ChallengeType | 'all' | 'actives'
type SortType = 'name' | 'participants' | 'recent'

// Headless hook for challenge filtering and sorting logic
export function useChallengeFiltering(challenges: Challenge[], userProgress: Record<string, any>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('recent')

  // Filtered and sorted challenges (preserving original business logic from HomePage)
  const filteredChallenges = useMemo(() => {
    const filtered = challenges?.filter((challenge) => {
      // Original search logic preserved
      const matchesSearch =
        challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Original filter logic preserved
      let matchesFilter = false
      if (selectedFilter === 'all') {
        matchesFilter = true
      } else if (selectedFilter === 'actives') {
        matchesFilter = !!userProgress[challenge.id]
      } else {
        matchesFilter = challenge.type === selectedFilter
      }

      return matchesSearch && matchesFilter && challenge.isActive
    })

    // Original sorting logic preserved
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'participants':
          return (
            (Array.isArray(b?.participants) ? b.participants.length : 0) -
            (Array.isArray(a?.participants) ? a.participants.length : 0)
          )
        case 'recent':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
    })

    return filtered
  }, [challenges, searchQuery, selectedFilter, sortBy, userProgress])

  // Helper functions that preserve original logic
  const joinedChallenges = useMemo(
    () => challenges.filter((challenge) => userProgress[challenge.id]),
    [challenges, userProgress],
  )

  const totalParticipants = useMemo(
    () =>
      challenges.reduce(
        (sum, challenge) => sum + (Array.isArray(challenge?.participants) ? challenge.participants.length : 0),
        0,
      ),
    [challenges],
  )

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedFilter('all')
    setSortBy('recent')
  }

  const setFilter = (filter: FilterType) => {
    setSelectedFilter(filter)
  }

  const setSort = (sort: SortType) => {
    setSortBy(sort)
  }

  return {
    // State
    searchQuery,
    selectedFilter,
    sortBy,

    // Computed values
    filteredChallenges,
    joinedChallenges,
    totalParticipants,

    // Actions
    setSearchQuery,
    setFilter,
    setSort,
    resetFilters,

    // Convenience setters
    setSelectedFilter,
    setSortBy,
  }
}

// Specialized hook for challenge search
export function useChallengeSearch(challenges: Challenge[]) {
  const [query, setQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!query.trim()) return challenges

    return challenges.filter(
      (challenge) =>
        challenge.name.toLowerCase().includes(query.toLowerCase()) ||
        challenge.description.toLowerCase().includes(query.toLowerCase()) ||
        challenge.type.toLowerCase().includes(query.toLowerCase()),
    )
  }, [challenges, query])

  const generateSuggestions = useMemo(() => {
    if (!query.trim()) return []

    const allWords = challenges.flatMap((challenge) => [
      ...challenge.name.split(' '),
      ...challenge.description.split(' '),
      challenge.type,
    ])

    return Array.from(
      new Set(
        allWords.filter(
          (word) => word.toLowerCase().includes(query.toLowerCase()) && word.toLowerCase() !== query.toLowerCase(),
        ),
      ),
    ).slice(0, 5)
  }, [challenges, query])

  return {
    query,
    setQuery,
    searchResults,
    suggestions: generateSuggestions,
    clearSearch: () => setQuery(''),
  }
}
