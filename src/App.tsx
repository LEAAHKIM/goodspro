import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <section className="get-started">
        <h2>the <i>git log</i> for your espresso extractions.</h2>
        <button id="get-started-button">get started</button>
      </section>
    </div>
  )
}

export default App