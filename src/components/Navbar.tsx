import './Navbar.css'

function Navbar() {
  return (
    <div className="nav-bar">
      <nav>
        <img id="logo" src="src/assets/logo.png" alt="goodspro" />
        <div className="nav-links">
          <a className="nav-item" href="">login</a>
          <a className="nav-item" href="">about</a>
        </div>
      </nav>
    </div>

  )
}

export default Navbar