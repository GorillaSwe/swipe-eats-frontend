import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";
import CategorySelectionPage from "./components/CategorySelectionPage";
import MapPage from "./components/MapPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CategorySelectionPage />} />
      <Route path="/search" element={ <SearchPage /> } />
      <Route path="/results" element={ <ResultsPage /> } />
      <Route path="/map" element={ <MapPage /> } />
    </Routes>
  );
}

export default App;