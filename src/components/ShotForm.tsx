import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ShotFormProps {
  beanId: string
  onShotAdded: () => void
}

function ShotForm({ beanId, onShotAdded }: ShotFormProps) {
  const [dose, setDose] = useState('18')
  const [grindSize, setGrindSize] = useState('')
  const [time, setTime] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase.from('shots').insert({
      bean_id: beanId,
      dose_grams: dose ? Number(dose) : null,
      grind_size: grindSize ? Number(grindSize) : null,
      extraction_time_seconds: time ? Number(time) : null,
      extraction_weight_grams: weight ? Number(weight) : null,
      tasting_notes: notes || null,
    })

    if (error) {
      console.error(error)
      return
    }

    setGrindSize('')
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
        Grind size 
        <input value={grindSize} onChange={(e) => setGrindSize(e.target.value)} placeholder="e.g. 3.5"/>
      </label>
      <div style={{display:"flex"}}>
        <label>
          Extraction time (s)
          <input value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label>
          Extraction weight (g)
          <input value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
      </div>
      <label>
        Tasting notes
        <input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <button type="submit">Log shot</button>
    </form>
  )
}

export default ShotForm