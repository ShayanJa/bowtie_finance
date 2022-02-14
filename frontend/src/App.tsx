import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Nav from './components/Nav'

import Home from './views/Home'
import About from './views/About'
import NotFound from './views/NotFound'
import Deposit from './views/Deposit'
import Withdraw from './views/Withdraw'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={Home}/>
        <Route path="/deposit" component={Deposit}/>
        <Route path="/withdraw" component={Withdraw}/>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
    </div>
  );
};

export default App;
