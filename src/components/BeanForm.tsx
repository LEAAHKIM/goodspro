import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface BeanFormProps {
  onBeanAdded: () => void
}

function BeanForm({ onBeanAdded }: BeanFormProps) {
  const [name, setName] = useState('')
  const [roast, setRoast] = useState('')
  const [roastDate, setRoastDate] = useState('')
  const [openedDate, setOpenedDate] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('Not logged in')
      return
    }

    const { error } = await supabase.from('beans').insert({
      name,
      roast,
      roast_date: roastDate || null,
      opened_date: openedDate || null,
      user_id: user.id,
    })

    if (error) {
      console.error(error)
      return
    }

    setName('')
    setRoast('')
    setRoastDate('')
    setOpenedDate('')
    onBeanAdded()  
  }

  return (
    <form onSubmit={handleSubmit} className="bean-form card" style={{display:'flex', gap:'7px', flexDirection:'column'}}>
      <h3>Add New</h3>
      <input
        placeholder="Bean name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Roast"
        value={roast}
        onChange={(e) => setRoast(e.target.value)}
        required
      />
      <label>
        Roast date
        <input type="date" value={roastDate} onChange={(e) => setRoastDate(e.target.value)} />
      </label>
      <label>
        Opened date
        <input type="date" value={openedDate} onChange={(e) => setOpenedDate(e.target.value)} />
      </label>
      <button type="submit">Add Bean</button>
    </form>
  )
}

export default BeanForm