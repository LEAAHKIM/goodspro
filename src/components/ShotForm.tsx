import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ShotFormProps {
  beanId: string
  onShotAdded: () => void
}

function ShotForm({ beanId, onShotAdded }: ShotFormProps) {
  const [dose, setDose] = useState('18')
  const [time, setTime] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase.from('shots').insert({
      bean_id: beanId,
      dose_grams: dose ? Number(dose) : null,
      extraction_time_seconds: time ? Number(time) : null,
      extraction_weight_grams: weight ? Number(weight) : null,
      tasting_notes: notes || null,
    })

    if (error) {
      console.error(error)
      return
    }

    setTime('')
    setWeight('')
    setNotes('')
    onShotAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="shot-form card">
      <label>
        Dose (g)
        <input value={dose} onChange={(e) => setDose(e.target.value)} />
      </label>
      <label>
        Extraction time (s)
        <input value={time} onChange={(e) => setTime(e.target.value)} />
      </label>
      <label>
        Extraction weight (g)
        <input value={weight} onChange={(e) => setWeight(e.target.value)} />
      </label>
      <label>
        Tasting notes
        <input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <button type="submit">Log shot</button>
    </form>
  )
}

export default ShotForm