import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Journal from './components/Journal';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
