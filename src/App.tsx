import { Routes, Route } from 'react-router-dom'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import BeanLibrary from './pages/BeanLibrary'
import BeanDetail from './pages/BeanDetail'
import { useUser } from './hooks/useUser'
import { supabase } from './lib/supabase'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const { user } = useUser()
  const navigate = useNavigate()

  async function handleGetStarted() {
    if (user) {
      navigate('/beans')
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/beans` },
      })
    }
  }

  return (
    <div>
      <Navbar />
      <Hero />
      <section className="get-started">
        <h2>it's time to extract good espresso.</h2>
        <button id="get-started-button" onClick={handleGetStarted}>get started</button>
      </section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/beans" element={<div><Navbar /><BeanLibrary /></div>} />
      <Route path="/beans/:beanId" element={<div><Navbar /><BeanDetail /></div>} />
    </Routes>
  )
}

export default App