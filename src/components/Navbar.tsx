import './Navbar.css'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'

function Navbar() {
  const { user } = useUser()

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }
  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="nav-bar">
      <nav>
        <div>      
          <a className="nav-item" href="">goodspro</a>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-item user">{user.email}</span>
              <button className="nav-item user" onClick={handleSignOut}>sign out</button>
            </>
          ) : (
            <button className="nav-item user" onClick={handleSignIn}>sign in</button>
          )}
          <a className="nav-item" href="">about</a>
        </div>
      </nav>
    </div>

  )
}

export default Navbar