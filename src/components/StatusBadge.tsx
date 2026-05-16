import React from 'react'
import type { ProblemStatus } from '../types'

interface Props {
  status: ProblemStatus
}

const config: Record<ProblemStatus, { classes: string }> = {
  'Not Started': {
    classes: 'text-[#5A6070] bg-[#111318] border border-[#1E2128]',
  },
  Attempted: {
    classes: 'text-[#F59E0B] bg-[#2A1F0A] border border-[#4A3510]',
  },
  Completed: {
    classes: 'text-[#22C55E] bg-[#0F2A1A] border border-[#1A4A2A]',
  },
  Review: {
    classes: 'text-[#A855F7] bg-[#1E0A2A] border border-[#3A1A4A]',
  },
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const { classes } = config[status]
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-sm ${classes}`}>
      {status}
    </span>
  )
}

export default StatusBadge
