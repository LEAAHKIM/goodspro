import { useState } from 'react'
import { supabase } from '../lib/supabase'

const FLAVOR_OPTIONS = ['sour', 'bitter', 'thin', 'dry', 'sweet', 'balanced', 'astringent']
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
  const [flavorTags, setFlavorTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    setFlavorTags((prev) => 
      prev.includes(tag) 
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase.from('shots').insert({
      bean_id: beanId,
      dose_grams: dose ? Number(dose) : null,
      grind_size: grindSize ? Number(grindSize) : null,
      extraction_time_seconds: time ? Number(time) : null,
      extraction_weight_grams: weight ? Number(weight) : null,
      tasting_notes: notes || null,
      flavor_tags: flavorTags.length > 0 ? flavorTags : null,
    })

    if (error) {
      console.error(error)
      return
    }

    setGrindSize('')
    setTime('')
    setWeight('')
    setNotes('')
    setFlavorTags([])
    onShotAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="shot-form card" style={{display:'flex', gap:'7px', flexDirection:'column'}}>
      <label>
        Dose (g)
        <input value={dose} onChange={(e) => setDose(e.target.value)} />
      </label>
      <label>
        Grind size 
        <input value={grindSize} onChange={(e) => setGrindSize(e.target.value)} placeholder="e.g. 3.5"/>
      </label>
      <label>
        Extraction time (s)
        <input value={time} onChange={(e) => setTime(e.target.value)}/>
      </label>
      <label>
        Extraction weight (g)
        <input value={weight} onChange={(e) => setWeight(e.target.value)}/>
      </label>
      <label>
        Tasting notes
        <input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <p>FLAVOR(S)</p>
      <div className="flavor-tags">
        {FLAVOR_OPTIONS.map((tag) => (
          <label key={tag} className="flavor-tag-option">
            <input
              type="checkbox"
              checked={flavorTags.includes(tag)}
              onChange={() => toggleTag(tag)}
            />
            {tag}
          </label>
        ))}
      </div>
      <button type="submit">Log shot</button>
    </form>
  )
}

export default ShotForm