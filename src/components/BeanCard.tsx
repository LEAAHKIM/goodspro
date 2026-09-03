import {useNavigate} from 'react-router-dom'
interface Bean {
  id: string
  name: string
  roast: string
  roast_date: string | null
  opened_date: string | null
  notes: string | null
}

interface BeanCardProps {
  bean: Bean
  onContextMenu: (e: React.MouseEvent, bean: Bean) => void
}

function BeanCard({ bean, onContextMenu }: BeanCardProps) {
  const navigate = useNavigate() 

  return (
    <div
      className="bean-card card"
      onClick={() => navigate(`/beans/${bean.id}`)}
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu(e, bean)
      }}
    >
      <h3>{bean.name}</h3>
      <p>{bean.roast}</p>
      {bean.roast_date && <p>Roasted: {bean.roast_date}</p>}
      {bean.opened_date && <p>Opened: {bean.opened_date}</p>}
    </div>
  )
}

export default BeanCard