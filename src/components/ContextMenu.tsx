 interface ContextMenuProps {
  x: number
  y: number
  onDelete: () => void
  onClose: () => void 
}

function ContextMenu({x, y, onDelete, onClose} : ContextMenuProps) {
  return (
    <>
      {}
      <div style={{position:'fixed', inset: 0, zIndex:10}} onClick={onClose}/>
      <div className="context-menu" style={{position:'fixed', top:y, left:x, zIndex: 20}}>
        <button onClick={onDelete}>Delete bean</button>
      </div>
    </>
  )
}

export default ContextMenu