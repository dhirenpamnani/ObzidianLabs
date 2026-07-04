import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import NeuralVortex from "./components/NeuralVortex";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-ember-50">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <NeuralVortex />
      </main>
      <Footer />
    </div>
  );
}

export default App;
