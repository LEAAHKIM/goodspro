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

interface ShotCardProps {
  shot: Shot
  onContextMenu: (e: React.MouseEvent, shot: Shot) => void
}

function ShotCard({ shot, onContextMenu }: ShotCardProps) {
  const formattedDate = new Date(shot.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

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
    </div>
  )
}

export default ShotCard