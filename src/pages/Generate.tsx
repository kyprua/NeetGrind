import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shuffle, ExternalLink, CheckCircle, BookmarkCheck, BookOpen } from 'lucide-react'
import { useProblems } from '../hooks/useProblems'
import { PROBLEMS, CATEGORIES } from '../data/problems'
import type { Difficulty, Problem, ProblemStatus } from '../types'
import DifficultyBadge from '../components/DifficultyBadge'
import StatusBadge from '../components/StatusBadge'

const Generate: React.FC = () => {
  const { userProblems, updateProblem } = useProblems()

  const [includeCompleted, setIncludeCompleted] = useState(false)
  const [difficulties, setDifficulties] = useState<Set<Difficulty>>(
    new Set(['Easy', 'Medium', 'Hard'])
  )
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [onlyReview, setOnlyReview] = useState(false)
  const [onlyNotStarted, setOnlyNotStarted] = useState(false)
  const [generated, setGenerated] = useState<Problem | null>(null)

  const toggleDifficulty = (d: Difficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev)
      if (next.has(d)) {
        next.delete(d)
      } else {
        next.add(d)
      }
      return next
    })
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  const handleGenerate = () => {
    let pool = PROBLEMS.filter((p) => {
      const up = userProblems.get(p.id)
      const status: ProblemStatus = up?.status ?? 'Not Started'

      if (!includeCompleted && status === 'Completed') return false
      if (!difficulties.has(p.difficulty)) return false
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false
      if (onlyReview && status !== 'Review') return false
      if (onlyNotStarted && status !== 'Not Started') return false

      return true
    })

    if (pool.length === 0) {
      setGenerated(null)
      return
    }

    const idx = Math.floor(Math.random() * pool.length)
    setGenerated(pool[idx])
  }

  const handleMarkCompleted = () => {
    if (!generated) return
    updateProblem(generated.id, { status: 'Completed' })
  }

  const handleMarkReview = () => {
    if (!generated) return
    updateProblem(generated.id, { status: 'Review' })
  }

  const handleMarkAttempted = () => {
    if (!generated) return
    updateProblem(generated.id, { status: 'Attempted' })
  }

  const generatedStatus = generated ? (userProblems.get(generated.id)?.status ?? 'Not Started') : null

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#E8EAF0] tracking-tight">Generate</h1>
        <p className="text-[#5A6070] text-sm mt-0.5">Get a random problem based on your filters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filter Panel */}
        <div className="bg-[#111318] border border-[#1E2128] p-4 h-fit">
          <h2 className="text-xs font-semibold text-[#5A6070] uppercase tracking-widest mb-4">
            Filters
          </h2>

          {/* Include Completed */}
          <div className="mb-4 pb-4 border-b border-[#1E2128]">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeCompleted}
                onChange={(e) => setIncludeCompleted(e.target.checked)}
                className="cursor-pointer"
              />
              <span className="text-sm text-[#9BA3B0] group-hover:text-[#E8EAF0] transition-colors">
                Include Completed
              </span>
            </label>
          </div>

          {/* Only Review */}
          <div className="mb-4 pb-4 border-b border-[#1E2128]">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyReview}
                onChange={(e) => {
                  setOnlyReview(e.target.checked)
                  if (e.target.checked) setOnlyNotStarted(false)
                }}
                className="cursor-pointer"
              />
              <span className="text-sm text-[#9BA3B0] group-hover:text-[#E8EAF0] transition-colors">
                Only Review Problems
              </span>
            </label>
          </div>

          {/* Only Not Started */}
          <div className="mb-4 pb-4 border-b border-[#1E2128]">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyNotStarted}
                onChange={(e) => {
                  setOnlyNotStarted(e.target.checked)
                  if (e.target.checked) setOnlyReview(false)
                }}
                className="cursor-pointer"
              />
              <span className="text-sm text-[#9BA3B0] group-hover:text-[#E8EAF0] transition-colors">
                Only Not Started
              </span>
            </label>
          </div>

          {/* Difficulty */}
          <div className="mb-4 pb-4 border-b border-[#1E2128]">
            <div className="text-xs text-[#5A6070] uppercase tracking-widest mb-2.5">
              Difficulty
            </div>
            <div className="space-y-1.5">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={difficulties.has(d)}
                    onChange={() => toggleDifficulty(d)}
                    className="cursor-pointer"
                  />
                  <DifficultyBadge difficulty={d} />
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs text-[#5A6070] uppercase tracking-widest">Category</div>
              {selectedCategories.size > 0 && (
                <button
                  onClick={() => setSelectedCategories(new Set())}
                  className="text-xs text-[#4A9EFF] hover:text-[#3A8EEF]"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="cursor-pointer"
                  />
                  <span className="text-xs text-[#9BA3B0] group-hover:text-[#E8EAF0] transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="lg:col-span-2">
          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#4A9EFF] text-[#0A0B0E] font-semibold rounded-sm hover:bg-[#3A8EEF] transition-colors mb-4"
          >
            <Shuffle size={16} />
            Generate Random Problem
          </button>

          {/* Generated Problem Card */}
          {generated ? (
            <div className="bg-[#111318] border border-[#1E2128]">
              {/* Problem Header */}
              <div className="p-5 border-b border-[#1E2128]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#5A6070] text-xs">#{generated.id}</span>
                      <DifficultyBadge difficulty={generated.difficulty} />
                      {generatedStatus && <StatusBadge status={generatedStatus} />}
                    </div>
                    <h2 className="text-lg font-semibold text-[#E8EAF0]">{generated.name}</h2>
                    <div className="text-[#5A6070] text-sm mt-1">{generated.category}</div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="p-5 border-b border-[#1E2128]">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={generated.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A3A5C] text-[#4A9EFF] text-sm font-medium rounded-sm hover:bg-[#2A4A6C] transition-colors"
                  >
                    <ExternalLink size={14} />
                    LeetCode
                  </a>
                  <a
                    href={generated.neetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#111318] border border-[#1E2128] text-[#9BA3B0] text-sm font-medium rounded-sm hover:border-[#4A9EFF] hover:text-[#E8EAF0] transition-colors"
                  >
                    <ExternalLink size={14} />
                    NeetCode
                  </a>
                  <Link
                    to={`/problem/${generated.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#111318] border border-[#1E2128] text-[#9BA3B0] text-sm font-medium rounded-sm hover:border-[#4A9EFF] hover:text-[#E8EAF0] transition-colors"
                  >
                    <BookOpen size={14} />
                    View Notes
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5">
                <div className="text-xs text-[#5A6070] uppercase tracking-widest mb-3">
                  Mark as
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleMarkCompleted}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors ${
                      generatedStatus === 'Completed'
                        ? 'bg-[#0F2A1A] text-[#22C55E] border border-[#1A4A2A]'
                        : 'bg-[#111318] border border-[#1E2128] text-[#9BA3B0] hover:border-[#22C55E] hover:text-[#22C55E]'
                    }`}
                  >
                    <CheckCircle size={14} />
                    Completed
                  </button>
                  <button
                    onClick={handleMarkReview}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors ${
                      generatedStatus === 'Review'
                        ? 'bg-[#1E0A2A] text-[#A855F7] border border-[#3A1A4A]'
                        : 'bg-[#111318] border border-[#1E2128] text-[#9BA3B0] hover:border-[#A855F7] hover:text-[#A855F7]'
                    }`}
                  >
                    <BookmarkCheck size={14} />
                    Mark for Review
                  </button>
                  <button
                    onClick={handleMarkAttempted}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors ${
                      generatedStatus === 'Attempted'
                        ? 'bg-[#2A1F0A] text-[#F59E0B] border border-[#4A3510]'
                        : 'bg-[#111318] border border-[#1E2128] text-[#9BA3B0] hover:border-[#F59E0B] hover:text-[#F59E0B]'
                    }`}
                  >
                    Attempted
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111318] border border-[#1E2128] border-dashed flex flex-col items-center justify-center py-20">
              <Shuffle size={40} className="text-[#1E2128] mb-4" />
              <p className="text-[#5A6070] text-sm">Click "Generate Random Problem" to get started</p>
              <p className="text-[#3A4050] text-xs mt-1">
                Adjust filters on the left to customize your selection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generate
