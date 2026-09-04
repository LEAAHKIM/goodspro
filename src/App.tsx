import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import BeanLibrary from './pages/BeanLibrary' 
import BeanDetail from './pages/BeanDetail'

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
              <h2>it's time to extract good espresso.</h2>
              <Link to="/beans" id="get-started-button" style={{textDecoration:"none"}}>get started</Link>
            </section>
        </div>
        }
      />
      <Route 
        path="/beans" 
        element={
          <div>
            <Navbar />
            <BeanLibrary />
          </div>
        }
      />
      <Route 
        path="/beans/:beanId" 
        element={
          <div>
            <Navbar/>
            <BeanDetail/>
          </div>
        }
      />
    </Routes>
  )
}

export default App