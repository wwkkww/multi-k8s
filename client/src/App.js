import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import OtherPage from './OtherPage'
import Fib from './Fib'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Fibonacci Calculator</h1>
            <Link to="/" style={{ color: '#FFF' }} >Home</Link>{"  |  "}
            <Link to="/otherpage" style={{ color: '#FFF' }} >About</Link>
          </header>
          <div style={{ marginTop: '10px' }}>
            <Route exact path="/" component={Fib} />
            <Route path="/otherpage" component={OtherPage} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
