import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./views/Home";
import About from "./views/About";
import NotFound from "./views/NotFound";
import BorrowPaybackPage from "./views/BorrowPaybackPage";
import DepositWithdrawPage from "./views/DepositBorrowPage";
import { useSubscribe } from "./state/application/hooks";
import FarmPage from "./views/Farm";
import { Toaster } from "react-hot-toast";

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
          <Route path="/farm" component={FarmPage} />
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            duration: 5000,
            style: {
              padding: "16px",
              background: "#343333",
              color: "#fff",
            },
            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
                duration: 5000,
                icon: "🔥",
              },
            },
            loading: {
              duration: 100000,
            },
          }}
        />
      </Router>
    </div>
  );
};

export default App;
