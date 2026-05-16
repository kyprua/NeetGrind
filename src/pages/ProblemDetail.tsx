import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ExternalLink, Save, ArrowLeft, Clock, Timer } from 'lucide-react'
import { useProblems } from '../hooks/useProblems'
import { PROBLEMS } from '../data/problems'
import type { ProblemStatus } from '../types'
import DifficultyBadge from '../components/DifficultyBadge'
import StatusBadge from '../components/StatusBadge'

const STATUSES: ProblemStatus[] = ['Not Started', 'Attempted', 'Completed', 'Review']

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userProblems, updateProblem, isLoading } = useProblems()

  const problem = PROBLEMS.find((p) => p.id === Number(id))

  const [status, setStatus] = useState<ProblemStatus>('Not Started')
  const [approach, setApproach] = useState('')
  const [mistakes, setMistakes] = useState('')
  const [timeComplexity, setTimeComplexity] = useState('')
  const [spaceComplexity, setSpaceComplexity] = useState('')
  const [keyPattern, setKeyPattern] = useState('')
  const [notes, setNotes] = useState('')
  const [solveTime, setSolveTime] = useState<string>('')
  const [reviewDate, setReviewDate] = useState<string>('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoading && problem) {
      const up = userProblems.get(problem.id)
      if (up) {
        setStatus(up.status)
        setApproach(up.approach)
        setMistakes(up.mistakes)
        setTimeComplexity(up.time_complexity)
        setSpaceComplexity(up.space_complexity)
        setKeyPattern(up.key_pattern)
        setNotes(up.notes)
        setSolveTime(up.solve_time_minutes?.toString() ?? '')
        setReviewDate(up.review_date ?? '')
      }
    }
  }, [isLoading, problem, userProblems])

  const handleSave = async () => {
    if (!problem) return
    await updateProblem(problem.id, {
      status,
      approach,
      mistakes,
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      key_pattern: keyPattern,
      notes,
      solve_time_minutes: solveTime ? parseInt(solveTime) : null,
      review_date: reviewDate || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5A6070] text-sm">Loading...</div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="p-6">
        <div className="text-[#5A6070] text-sm">Problem not found.</div>
        <button
          onClick={() => navigate('/problems')}
          className="mt-4 text-[#4A9EFF] text-sm hover:text-[#3A8EEF]"
        >
          ← Back to Problems
        </button>
      </div>
    )
  }

  const currentUp = userProblems.get(problem.id)

  return (
    <div className="p-6 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[#5A6070] text-sm hover:text-[#9BA3B0] transition-colors mb-5"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Problem Header */}
      <div className="bg-[#111318] border border-[#1E2128] p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#5A6070] text-xs">#{problem.id}</span>
              <DifficultyBadge difficulty={problem.difficulty} />
              <StatusBadge status={status} />
            </div>
            <h1 className="text-xl font-semibold text-[#E8EAF0]">{problem.name}</h1>
            <div className="text-[#5A6070] text-sm mt-1">{problem.category}</div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A3A5C] text-[#4A9EFF] text-xs font-medium rounded-sm hover:bg-[#2A4A6C] transition-colors"
            >
              <ExternalLink size={12} />
              LeetCode
            </a>
            <a
              href={problem.neetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111318] border border-[#1E2128] text-[#9BA3B0] text-xs rounded-sm hover:border-[#4A9EFF] hover:text-[#E8EAF0] transition-colors"
            >
              <ExternalLink size={12} />
              NeetCode
            </a>
          </div>
        </div>

        {/* Last attempted */}
        {currentUp?.last_attempted && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#5A6070]">
            <Clock size={11} />
            Last attempted: {new Date(currentUp.last_attempted).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Status + Timer Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Status */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProblemStatus)}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Solve Time */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="flex items-center gap-1.5 text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            <Timer size={11} />
            Solve Time (min)
          </label>
          <input
            type="number"
            value={solveTime}
            onChange={(e) => setSolveTime(e.target.value)}
            placeholder="e.g. 30"
            min="0"
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          />
        </div>

        {/* Review Date */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Review Date
          </label>
          <input
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {/* Complexity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Time Complexity
          </label>
          <input
            type="text"
            value={timeComplexity}
            onChange={(e) => setTimeComplexity(e.target.value)}
            placeholder="e.g. O(n log n)"
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          />
        </div>
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Space Complexity
          </label>
          <input
            type="text"
            value={spaceComplexity}
            onChange={(e) => setSpaceComplexity(e.target.value)}
            placeholder="e.g. O(n)"
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {/* Text fields */}
      <div className="space-y-3 mb-4">
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            My Approach
          </label>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Describe your approach to solving this problem..."
            rows={4}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF] resize-y"
          />
        </div>

        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Key Pattern / Insight
          </label>
          <textarea
            value={keyPattern}
            onChange={(e) => setKeyPattern(e.target.value)}
            placeholder="What is the core insight or pattern for this problem?"
            rows={3}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF] resize-y"
          />
        </div>

        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            Mistakes Made
          </label>
          <textarea
            value={mistakes}
            onChange={(e) => setMistakes(e.target.value)}
            placeholder="What mistakes did you make? What tripped you up?"
            rows={3}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF] resize-y"
          />
        </div>

        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <label className="block text-xs text-[#5A6070] uppercase tracking-widest mb-2">
            General Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other notes, edge cases, or things to remember..."
            rows={4}
            className="w-full px-2 py-1.5 text-sm bg-[#0A0B0E] border border-[#1E2128] text-[#E8EAF0] rounded-sm focus:border-[#4A9EFF] resize-y"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm transition-colors ${
          saved
            ? 'bg-[#0F2A1A] text-[#22C55E] border border-[#1A4A2A]'
            : 'bg-[#4A9EFF] text-[#0A0B0E] hover:bg-[#3A8EEF]'
        }`}
      >
        <Save size={14} />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}

export default ProblemDetail
