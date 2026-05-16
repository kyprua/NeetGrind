import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useProblems } from '../hooks/useProblems'
import { PROBLEMS, CATEGORIES } from '../data/problems'
import type { ProblemStatus } from '../types'

const STATUS_COLORS: Record<ProblemStatus, string> = {
  'Not Started': '#1E2128',
  Attempted: '#F59E0B',
  Completed: '#22C55E',
  Review: '#A855F7',
}

const DIFF_COLORS = {
  Easy: '#22C55E',
  Medium: '#F59E0B',
  Hard: '#EF4444',
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161820] border border-[#1E2128] px-3 py-2 text-xs">
        <p className="text-[#9BA3B0] mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-[#E8EAF0] font-medium">
            {entry.value} completed
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Stats: React.FC = () => {
  const { userProblems, isLoading } = useProblems()

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catProblems = PROBLEMS.filter((p) => p.category === cat)
      const completed = catProblems.filter((p) => userProblems.get(p.id)?.status === 'Completed').length
      const total = catProblems.length
      return { name: cat, completed, total, pct: Math.round((completed / total) * 100) }
    })
  }, [userProblems])

  const difficultyData = useMemo(() => {
    const diffs = ['Easy', 'Medium', 'Hard'] as const
    return diffs.map((d) => {
      const probs = PROBLEMS.filter((p) => p.difficulty === d)
      const completed = probs.filter((p) => userProblems.get(p.id)?.status === 'Completed').length
      const remaining = probs.length - completed
      return { name: d, completed, remaining, total: probs.length }
    })
  }, [userProblems])

  const statusData = useMemo(() => {
    const counts: Record<ProblemStatus, number> = {
      'Not Started': 0,
      Attempted: 0,
      Completed: 0,
      Review: 0,
    }
    PROBLEMS.forEach((p) => {
      const status = userProblems.get(p.id)?.status ?? 'Not Started'
      counts[status]++
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value })) as {
      name: ProblemStatus
      value: number
    }[]
  }, [userProblems])

  const pieData = useMemo(() => {
    return difficultyData
      .map((d) => ({ name: d.name, value: d.completed }))
      .filter((d) => d.value > 0)
  }, [difficultyData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5A6070] text-sm">Loading...</div>
      </div>
    )
  }

  const totalCompleted = statusData.find((s) => s.name === 'Completed')?.value ?? 0

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#E8EAF0] tracking-tight">Statistics</h1>
        <p className="text-[#5A6070] text-sm mt-0.5">
          {totalCompleted} of 150 problems completed
        </p>
      </div>

      {/* Status Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statusData.map(({ name, value }) => (
          <div key={name} className="bg-[#111318] border border-[#1E2128] p-4">
            <div
              className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: STATUS_COLORS[name] }}
            >
              {name}
            </div>
            <div className="text-2xl font-bold text-[#E8EAF0]">{value}</div>
            <div className="text-[#5A6070] text-xs mt-0.5">
              {Math.round((value / 150) * 100)}% of total
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Difficulty Completion Pie */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <h2 className="text-xs font-semibold text-[#5A6070] uppercase tracking-widest mb-4">
            Completed by Difficulty
          </h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#5A6070] text-sm">
              No completed problems yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={DIFF_COLORS[entry.name as keyof typeof DIFF_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161820',
                    border: '1px solid #1E2128',
                    borderRadius: '0',
                    fontSize: '12px',
                    color: '#E8EAF0',
                  }}
                />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#9BA3B0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Difficulty Stats */}
          <div className="mt-2 space-y-2">
            {difficultyData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span style={{ color: DIFF_COLORS[d.name as keyof typeof DIFF_COLORS] }}>
                  {d.name}
                </span>
                <span className="text-[#5A6070]">
                  {d.completed}/{d.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Donut */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <h2 className="text-xs font-semibold text-[#5A6070] uppercase tracking-widest mb-4">
            Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161820',
                  border: '1px solid #1E2128',
                  borderRadius: '0',
                  fontSize: '12px',
                  color: '#E8EAF0',
                }}
              />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#9BA3B0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span style={{ color: STATUS_COLORS[s.name] }}>{s.name}</span>
                <span className="text-[#5A6070]">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Summary */}
        <div className="bg-[#111318] border border-[#1E2128] p-4">
          <h2 className="text-xs font-semibold text-[#5A6070] uppercase tracking-widest mb-4">
            Top Categories
          </h2>
          <div className="space-y-2.5">
            {[...categoryData]
              .sort((a, b) => b.pct - a.pct)
              .map(({ name, completed: done, total, pct }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9BA3B0] truncate mr-2">{name}</span>
                    <span className="text-[#5A6070] flex-shrink-0">
                      {done}/{total}
                    </span>
                  </div>
                  <div className="h-1 bg-[#1E2128]">
                    <div
                      className="h-1 transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? '#22C55E' : pct > 50 ? '#4A9EFF' : '#2A4A6C',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="bg-[#111318] border border-[#1E2128] p-4">
        <h2 className="text-xs font-semibold text-[#5A6070] uppercase tracking-widest mb-4">
          Problems Completed per Category
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={categoryData}
            margin={{ top: 4, right: 8, left: -20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#5A6070', fontSize: 10 }}
              axisLine={{ stroke: '#1E2128' }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: '#5A6070', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,158,255,0.05)' }} />
            <Bar dataKey="completed" fill="#4A9EFF" radius={[1, 1, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Stats
