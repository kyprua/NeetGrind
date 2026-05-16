import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shuffle, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useProblems } from '../hooks/useProblems'
import { PROBLEMS, CATEGORIES } from '../data/problems'
import DifficultyBadge from '../components/DifficultyBadge'
import StatusBadge from '../components/StatusBadge'

const Dashboard: React.FC = () => {
  const { userProblems, isLoading } = useProblems()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const total = PROBLEMS.length
    const completed = Array.from(userProblems.values()).filter((up) => up.status === 'Completed').length
    const attempted = Array.from(userProblems.values()).filter((up) => up.status === 'Attempted').length
    const review = Array.from(userProblems.values()).filter((up) => up.status === 'Review').length

    const easyProblems = PROBLEMS.filter((p) => p.difficulty === 'Easy')
    const mediumProblems = PROBLEMS.filter((p) => p.difficulty === 'Medium')
    const hardProblems = PROBLEMS.filter((p) => p.difficulty === 'Hard')

    const easyDone = easyProblems.filter((p) => userProblems.get(p.id)?.status === 'Completed').length
    const mediumDone = mediumProblems.filter((p) => userProblems.get(p.id)?.status === 'Completed').length
    const hardDone = hardProblems.filter((p) => userProblems.get(p.id)?.status === 'Completed').length

    return {
      total,
      completed,
      attempted,
      review,
      easyTotal: easyProblems.length,
      mediumTotal: mediumProblems.length,
      hardTotal: hardProblems.length,
      easyDone,
      mediumDone,
      hardDone,
    }
  }, [userProblems])

  const categoryProgress = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catProblems = PROBLEMS.filter((p) => p.category === cat)
      const done = catProblems.filter((p) => userProblems.get(p.id)?.status === 'Completed').length
      return { cat, total: catProblems.length, done, pct: catProblems.length ? (done / catProblems.length) * 100 : 0 }
    })
  }, [userProblems])

  const recentActivity = useMemo(() => {
    return Array.from(userProblems.values())
      .filter((up) => up.last_attempted && up.status !== 'Not Started')
      .sort((a, b) => {
        if (!a.last_attempted) return 1
        if (!b.last_attempted) return -1
        return new Date(b.last_attempted).getTime() - new Date(a.last_attempted).getTime()
      })
      .slice(0, 5)
  }, [userProblems])

  const handleGenerateRandom = () => {
    navigate('/generate')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5A6070] text-sm">Loading...</div>
      </div>
    )
  }

  const completionPct = Math.round((stats.completed / stats.total) * 100)

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#E8EAF0] tracking-tight">Dashboard</h1>
          <p className="text-[#5A6070] text-sm mt-0.5">Track your NeetCode 150 progress</p>
        </div>
        <button
          onClick={handleGenerateRandom}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A9EFF] text-[#0A0B0E] text-sm font-semibold rounded-sm hover:bg-[#3A8EEF] transition-colors"
        >
          <Shuffle size={14} />
          Random Problem
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Total */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#5A6070] text-xs uppercase tracking-widest">Total</span>
            <TrendingUp size={14} className="text-[#4A9EFF]" />
          </div>
          <div className="text-2xl font-bold text-[#E8EAF0]">
            {stats.completed}
            <span className="text-[#5A6070] text-base font-normal">/{stats.total}</span>
          </div>
          <div className="mt-2 h-1 bg-[#1E2128] rounded-none">
            <div
              className="h-1 bg-[#4A9EFF] transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="text-[#5A6070] text-xs mt-1">{completionPct}% complete</div>
        </div>

        {/* Easy */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#5A6070] text-xs uppercase tracking-widest">Easy</span>
            <CheckCircle2 size={14} className="text-[#22C55E]" />
          </div>
          <div className="text-2xl font-bold text-[#22C55E]">
            {stats.easyDone}
            <span className="text-[#5A6070] text-base font-normal">/{stats.easyTotal}</span>
          </div>
          <div className="mt-2 h-1 bg-[#1E2128]">
            <div
              className="h-1 bg-[#22C55E] transition-all"
              style={{ width: `${(stats.easyDone / stats.easyTotal) * 100}%` }}
            />
          </div>
          <div className="text-[#5A6070] text-xs mt-1">
            {Math.round((stats.easyDone / stats.easyTotal) * 100)}% complete
          </div>
        </div>

        {/* Medium */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#5A6070] text-xs uppercase tracking-widest">Medium</span>
            <AlertCircle size={14} className="text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#F59E0B]">
            {stats.mediumDone}
            <span className="text-[#5A6070] text-base font-normal">/{stats.mediumTotal}</span>
          </div>
          <div className="mt-2 h-1 bg-[#1E2128]">
            <div
              className="h-1 bg-[#F59E0B] transition-all"
              style={{ width: `${(stats.mediumDone / stats.mediumTotal) * 100}%` }}
            />
          </div>
          <div className="text-[#5A6070] text-xs mt-1">
            {Math.round((stats.mediumDone / stats.mediumTotal) * 100)}% complete
          </div>
        </div>

        {/* Hard */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#5A6070] text-xs uppercase tracking-widest">Hard</span>
            <Clock size={14} className="text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold text-[#EF4444]">
            {stats.hardDone}
            <span className="text-[#5A6070] text-base font-normal">/{stats.hardTotal}</span>
          </div>
          <div className="mt-2 h-1 bg-[#1E2128]">
            <div
              className="h-1 bg-[#EF4444] transition-all"
              style={{ width: `${(stats.hardDone / stats.hardTotal) * 100}%` }}
            />
          </div>
          <div className="text-[#5A6070] text-xs mt-1">
            {Math.round((stats.hardDone / stats.hardTotal) * 100)}% complete
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Progress */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <h2 className="text-sm font-semibold text-[#E8EAF0] mb-4 uppercase tracking-widest">
            Category Progress
          </h2>
          <div className="space-y-3">
            {categoryProgress.map(({ cat, total, done, pct }) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#9BA3B0] text-xs">{cat}</span>
                  <span className="text-[#5A6070] text-xs">
                    {done}/{total}
                  </span>
                </div>
                <div className="h-1 bg-[#1E2128]">
                  <div
                    className="h-1 bg-[#4A9EFF] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <h2 className="text-sm font-semibold text-[#E8EAF0] mb-4 uppercase tracking-widest">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <div className="text-[#5A6070] text-sm py-8 text-center">
              No activity yet. Start solving problems!
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((up) => {
                const problem = PROBLEMS.find((p) => p.id === up.problem_id)
                if (!problem) return null
                return (
                  <Link
                    key={up.problem_id}
                    to={`/problem/${up.problem_id}`}
                    className="flex items-center justify-between p-2.5 bg-[#0A0B0E] border border-[#1E2128] hover:border-[#4A9EFF] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[#5A6070] text-xs w-6 text-right flex-shrink-0">
                        #{problem.id}
                      </span>
                      <span className="text-[#9BA3B0] text-xs group-hover:text-[#E8EAF0] truncate transition-colors">
                        {problem.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <DifficultyBadge difficulty={problem.difficulty} />
                      <StatusBadge status={up.status} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
          {recentActivity.length > 0 && (
            <Link
              to="/problems"
              className="mt-3 block text-center text-xs text-[#4A9EFF] hover:text-[#3A8EEF] transition-colors"
            >
              View all problems →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
