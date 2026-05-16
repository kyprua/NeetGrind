import React from 'react'
import type { Difficulty } from '../types'

interface Props {
  difficulty: Difficulty
}

const config: Record<Difficulty, { text: string; classes: string }> = {
  Easy: {
    text: 'Easy',
    classes: 'text-[#22C55E] bg-[#0F2A1A] border border-[#1A4A2A]',
  },
  Medium: {
    text: 'Medium',
    classes: 'text-[#F59E0B] bg-[#2A1F0A] border border-[#4A3510]',
  },
  Hard: {
    text: 'Hard',
    classes: 'text-[#EF4444] bg-[#2A0F0F] border border-[#4A1A1A]',
  },
}

const DifficultyBadge: React.FC<Props> = ({ difficulty }) => {
  const { text, classes } = config[difficulty]
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-sm ${classes}`}>
      {text}
    </span>
  )
}

export default DifficultyBadge
