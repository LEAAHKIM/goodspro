import { useState } from 'react'
import { supabase } from '../lib/supabase'
export interface Shot {
  id: string
  bean_id: string
  dose_grams: number | null
  grind_size: number
  extraction_time_seconds: number | null
  extraction_weight_grams: number | null
  tasting_notes: string | null
  flavor_tags: string[] | null
  created_at: string
}

export interface ShotAnalysis {
  diagnosis:
    | "under_extracted"
    | "over_extracted"
    | "balanced"
    | "uncertain"
  confidence: number
  evidence: string[]
  recommendation: {
    variable: "grind" | "dose" | "yield" | "temperature"
    direction: "finer" | "coarser" | "increase" | "decrease"
    magnitude: "small" | "moderate" | "large"
  }
  explanation: string
}
interface ShotCardProps {
  shot: Shot
  onContextMenu: (e: React.MouseEvent, shot: Shot) => void
}

function ShotCard({ shot, onContextMenu }: ShotCardProps) {
  const formattedDate = new Date(shot.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const [analysis, setAnalysis] = useState<ShotAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  async function handleAnalyzeShot() {
    setAnalyzing(true)
    setAnalysisError(null)

    const { data, error } = await supabase.functions.invoke(
      'analyze-shot',
      {
        body: {
          dose: shot.dose_grams,
          grindSize: shot.grind_size,
          time: shot.extraction_time_seconds,
          weight: shot.extraction_weight_grams,
          notes: shot.tasting_notes,
          flavorTags: shot.flavor_tags,
        },
      }
    )

    if (error) {
      console.error('AI analysis error:', error)
      setAnalysisError(error.message)
      setAnalyzing(false)
      return
    }
    console.log('AI analysis:', data.analysis)
    setAnalysis(data.analysis)
    setAnalyzing(false)
  }
  return (
    <div
      className="shot-card card"
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu(e, shot)
      }}
    >
      <span className="shot-date">{formattedDate}</span>
      <p>Dose: {shot.dose_grams}g</p>
      {shot.grind_size && <p>Grind: {shot.grind_size}</p>}
      <p>Time: {shot.extraction_time_seconds}s</p>
      <p>Yield: {shot.extraction_weight_grams}g</p>
      {shot.tasting_notes && <p>Notes: {shot.tasting_notes}</p>}
      {shot.flavor_tags && shot.flavor_tags.length > 0 && (
      <p>{shot.flavor_tags.join(', ')}</p>
)}
      <button onClick={handleAnalyzeShot} disabled={analyzing}>
      {analyzing ? 'Analyzing...' : 'Analyze Shot'}
      </button>
    </div>
  )
}

export default ShotCard