export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemStatus = 'Not Started' | 'Attempted' | 'Completed' | 'Review'

export interface Problem {
  id: number
  name: string
  leetcodeUrl: string
  neetcodeUrl: string
  difficulty: Difficulty
  category: string
}

export interface UserProblem {
  id: string
  user_id: string
  problem_id: number
  status: ProblemStatus
  last_attempted: string | null
  notes: string
  approach: string
  time_complexity: string
  space_complexity: string
  key_pattern: string
  mistakes: string
  solve_time_minutes: number | null
  review_date: string | null
}
