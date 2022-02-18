import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Nav from "./components/Nav";

import Home from "./views/Home";
import About from "./views/About";
import NotFound from "./views/NotFound";
import Deposit from "./views/Deposit";
import Withdraw from "./views/Withdraw";
import BorrowPaybackPage from "./views/BorrowPaybackPage";
import DepositWithdrawPage from './views/DepositBorrowPage'
import { useSubscribe } from "./state/application/hooks";

const App = () => {
  useSubscribe();
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900">
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/" component={About} />
          <Route path="/portfolio" component={Home} />
          <Route path="/deposit" component={DepositWithdrawPage} />
          <Route path="/borrow" component={BorrowPaybackPage} />
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
