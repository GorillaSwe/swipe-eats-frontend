import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";
import CategorySelectionPage from "./components/CategorySelectionPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CategorySelectionPage />} />
      <Route path="/search" element={ <SearchPage /> } />
      <Route path="/results" element={ <ResultsPage /> } />
    </Routes>
  );
}

export default App;