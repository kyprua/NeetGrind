import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import { useProblems } from '../hooks/useProblems'
import { PROBLEMS, CATEGORIES } from '../data/problems'
import type { Difficulty, ProblemStatus } from '../types'
import DifficultyBadge from '../components/DifficultyBadge'
import StatusBadge from '../components/StatusBadge'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']
const STATUSES: ProblemStatus[] = ['Not Started', 'Attempted', 'Completed', 'Review']

const ProblemList: React.FC = () => {
  const { userProblems, updateProblem, isLoading } = useProblems()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'All'>('All')

  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toString().includes(search)
      const matchDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter
      const up = userProblems.get(p.id)
      const status = up?.status ?? 'Not Started'
      const matchStatus = statusFilter === 'All' || status === statusFilter
      return matchSearch && matchDifficulty && matchCategory && matchStatus
    })
  }, [search, difficultyFilter, categoryFilter, statusFilter, userProblems])

  const handleRowClick = (id: number) => {
    navigate(`/problem/${id}`)
  }

  const handleToggleComplete = (e: React.MouseEvent, problemId: number) => {
    e.stopPropagation()
    const current = userProblems.get(problemId)?.status ?? 'Not Started'
    const next: ProblemStatus = current === 'Completed' ? 'Not Started' : 'Completed'
    updateProblem(problemId, { status: next })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5A6070] text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#E8EAF0] tracking-tight">Problems</h1>
        <p className="text-[#5A6070] text-sm mt-0.5">
          {filtered.length} of {PROBLEMS.length} problems
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6070]" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#111318] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          />
        </div>

        {/* Difficulty */}
        <div className="relative">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'All')}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-[#111318] border border-[#1E2128] text-[#9BA3B0] rounded-sm focus:border-[#4A9EFF] cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6070] pointer-events-none" />
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-[#111318] border border-[#1E2128] text-[#9BA3B0] rounded-sm focus:border-[#4A9EFF] cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6070] pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProblemStatus | 'All')}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-[#111318] border border-[#1E2128] text-[#9BA3B0] rounded-sm focus:border-[#4A9EFF] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6070] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#1E2128] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111318] border-b border-[#1E2128]">
              <th className="w-10 px-3 py-2.5 text-left">
                <span className="sr-only">Complete</span>
              </th>
              <th className="px-3 py-2.5 text-left text-[#5A6070] text-xs font-medium uppercase tracking-widest w-12">
                #
              </th>
              <th className="px-3 py-2.5 text-left text-[#5A6070] text-xs font-medium uppercase tracking-widest">
                Name
              </th>
              <th className="px-3 py-2.5 text-left text-[#5A6070] text-xs font-medium uppercase tracking-widest hidden lg:table-cell">
                Category
              </th>
              <th className="px-3 py-2.5 text-left text-[#5A6070] text-xs font-medium uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-3 py-2.5 text-left text-[#5A6070] text-xs font-medium uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-[#5A6070] text-sm">
                  No problems match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((problem) => {
                const up = userProblems.get(problem.id)
                const status = up?.status ?? 'Not Started'
                const isCompleted = status === 'Completed'
                return (
                  <tr
                    key={problem.id}
                    onClick={() => handleRowClick(problem.id)}
                    className="border-b border-[#1E2128] hover:bg-[#111318] cursor-pointer transition-colors group"
                  >
                    <td className="px-3 py-2.5" onClick={(e) => handleToggleComplete(e, problem.id)}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => {}}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-[#5A6070] text-xs">{problem.id}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[#9BA3B0] group-hover:text-[#E8EAF0] transition-colors text-sm">
                        {problem.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#5A6070] text-xs hidden lg:table-cell">
                      {problem.category}
                    </td>
                    <td className="px-3 py-2.5">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProblemList
