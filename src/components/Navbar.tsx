import './Navbar.css'

function Navbar() {
  return (
    <div className="nav-bar">
      <nav>
        <div>      
          <a className="nav-item" href="">goodspro</a>
        </div>
        <div className="nav-links">
          <a className="nav-item" href="">login</a>
          <a className="nav-item" href="">about</a>
        </div>
      </nav>
    </div>

  )
}

export default Navbar