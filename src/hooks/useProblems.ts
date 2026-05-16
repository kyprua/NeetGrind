import { useState, useEffect, useCallback } from 'react'
import type { UserProblem } from '../types'
import { PROBLEMS } from '../data/problems'

const STORAGE_KEY = 'neetgrind_user_problems'

const createDefaultUserProblem = (problemId: number): UserProblem => ({
  id: `local-${problemId}`,
  user_id: 'local',
  problem_id: problemId,
  status: 'Not Started',
  last_attempted: null,
  notes: '',
  approach: '',
  time_complexity: '',
  space_complexity: '',
  key_pattern: '',
  mistakes: '',
  solve_time_minutes: null,
  review_date: null,
})

const loadFromLocalStorage = (): Map<number, UserProblem> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Map()
    const arr: UserProblem[] = JSON.parse(raw)
    return new Map(arr.map((up) => [up.problem_id, up]))
  } catch {
    return new Map()
  }
}

const saveToLocalStorage = (map: Map<number, UserProblem>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())))
}

export const useProblems = () => {
  const [userProblems, setUserProblems] = useState<Map<number, UserProblem>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const map = loadFromLocalStorage()
    PROBLEMS.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, createDefaultUserProblem(p.id))
    })
    setUserProblems(new Map(map))
    setIsLoading(false)
  }, [])

  const updateProblem = useCallback(
    (problemId: number, updates: Partial<UserProblem>) => {
      const existing = userProblems.get(problemId) ?? createDefaultUserProblem(problemId)
      const updated: UserProblem = {
        ...existing,
        ...updates,
        last_attempted: new Date().toISOString(),
      }
      const newMap = new Map(userProblems)
      newMap.set(problemId, updated)
      setUserProblems(newMap)
      saveToLocalStorage(newMap)
    },
    [userProblems]
  )

  return { userProblems, updateProblem, isLoading }
}
