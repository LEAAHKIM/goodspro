import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ShotForm from '../components/ShotForm'
import ShotCard from '../components/ShotCard'
import ContextMenu from '../components/ContextMenu'

interface Bean {
  id: string
  name: string
  roast: string
  roast_date: string | null
  opened_date: string | null
  notes: string | null
}

interface Shot {
  id: string
  bean_id: string
  dose_grams: number | null
  grind_size: number
  extraction_time_seconds: number | null
  extraction_weight_grams: number | null
  tasting_notes: string | null
  created_at: string
}

function BeanDetail() {
  const { beanId } = useParams()
  const [bean, setBean] = useState<Bean | null>(null)
  const [shots, setShots] = useState<Shot[]>([])
  const [menu, setMenu] = useState<{ x: number; y: number; shot: Shot } | null>(null)

  async function fetchBean() {
    const { data, error } = await supabase
      .from('beans')
      .select('*')
      .eq('id', beanId)
      .single()

    if (error) {
      console.error(error)
      return
    }
    setBean(data)
  }

  async function fetchShots() {
    const { data, error } = await supabase
      .from('shots')
      .select('*')
      .eq('bean_id', beanId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }
    setShots(data)
  }

  useEffect(() => {
    fetchBean()
    fetchShots()
  }, [beanId])

  function handleShotContextMenu(e: React.MouseEvent, shot: Shot) {
    setMenu({ x: e.clientX, y: e.clientY, shot })
  }

  async function handleDeleteShot() {
    if (!menu) return

    const { error } = await supabase.from('shots').delete().eq('id', menu.shot.id)

    if (error) {
      console.error(error)
      return
    }

    setMenu(null)
    fetchShots()
  }

  if (!bean) return <p>Loading...</p>

  return (
    <div style={{ margin:'1rem', padding:'2rem', border:'2px black solid'}}>
      <h1>{bean.name}</h1>
      <div style={{padding: '2rem', border:'2.5px #e5e5e5 dotted', width:'fit-content', borderRadius: '12px'}}>
        <p>{bean.roast}</p>
        {bean.roast_date && <p>Roasted: {bean.roast_date}</p>}
        {bean.opened_date && <p>Opened: {bean.opened_date}</p>}
      </div>
      <h2>LOG YOUR SHOT</h2>
      <ShotForm beanId={beanId!} onShotAdded={fetchShots} />

      <h2>Shot history</h2>
      {shots.length === 0 ? (
        <p>No shots logged yet.</p>
      ) : (
        <div className="shot-grid" style={{display:'flex'}}>
          {shots.map((shot) => (
            <ShotCard key={shot.id} shot={shot} onContextMenu={handleShotContextMenu} />
          ))}
        </div>
      )}

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onDelete={handleDeleteShot}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  )
}

export default BeanDetail