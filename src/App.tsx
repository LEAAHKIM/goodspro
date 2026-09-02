import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import BeanLibrary from './pages/BeanLibrary' 

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
          <Navbar />
            <Hero />
            <section className="get-started">
              <h2>the <i>git log</i> for your espresso extractions.</h2>
              <Link to="/beans" id="get-started-button">get started</Link>
            </section>
        </div>
      }
      />
      <Route path="/beans" element={<BeanLibrary/>}/>
    </Routes>
  )
}

export default App