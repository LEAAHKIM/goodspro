import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  )
}

export default Hero