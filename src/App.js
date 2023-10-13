import React from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import Home from '../src/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
