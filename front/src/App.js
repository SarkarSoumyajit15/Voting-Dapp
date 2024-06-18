
import './App.css';


import React from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Voter from './components/Voter';

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route exact path="/" element={<Home/>}/> 
          <Route exact path="/admin" element={<Admin/>}/>
          <Route exact path="/voter" element={<Voter/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
