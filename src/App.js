import React from "react";
import Header from "./components/Header";
import Hero from "./hero";
import Mint from "./mint";
import Footer from "./components/Footer";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Hero />
      <Mint />
      <Footer />
    </React.Fragment>
  );
}

export default App;
