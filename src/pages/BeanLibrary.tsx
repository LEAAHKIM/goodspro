import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BeanForm from '../components/BeanForm'
import BeanCard from '../components/BeanCard'
import ContextMenu from '../components/ContextMenu'

interface Bean {
  id: string
  name: string
  roast: string
  roast_date: string | null
  opened_date: string | null
  notes: string | null
}

function BeanLibrary() {
  const [beans, setBeans] = useState<Bean[]>([])
  const [menu, setMenu] = useState<{ x: number; y: number; bean: Bean } | null>(null)

  async function fetchBeans() {
    const { data, error } = await supabase
      .from('beans')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }
    setBeans(data)
  }

  useEffect(() => {
    fetchBeans()
  }, [])

  function handleCardContextMenu(e: React.MouseEvent, bean: Bean) {
    setMenu({ x: e.clientX, y: e.clientY, bean })
  }

  async function handleDelete() {
    if (!menu) return

    const { error } = await supabase.from('beans').delete().eq('id', menu.bean.id)

    if (error) {
      console.error(error)
      return
    }

    setMenu(null)
    fetchBeans()
  }

  return (
    <div style={{ padding: '2rem'}}>
      <h1>Your Beans</h1>
      <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
        <BeanForm onBeanAdded={fetchBeans} />
        {beans.length === 0 ? (
          <p>No beans logged yet.</p>
        ) : (
          <div className="bean-grid">
            {beans.map((bean) => (
              <BeanCard key={bean.id} bean={bean} onContextMenu={handleCardContextMenu} />
            ))}
          </div>
        )}

        {menu && (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            onDelete={handleDelete}
            onClose={() => setMenu(null)}
          />
        )}
        </div>
    </div>
  )
}

export default BeanLibrary