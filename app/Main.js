import React, { useState } from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";

function Main() {
	const [loggedIn, setLoggedIn] = useState(
		Boolean(localStorage.getItem("social-app-token"))
	);
	return (
		<BrowserRouter>
			<Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Switch>
				<Route path="/" exact>
					{loggedIn ? <Home /> : <HomeGuest />}
				</Route>
				<Route path="/about-us" exact>
					{" "}
					<About />
				</Route>
				<Route path="/terms" exact>
					{" "}
					<Terms />
				</Route>
			</Switch>
			<Footer />
		</BrowserRouter>
	);
}

ReactDom.render(<Main />, document.querySelector("#app"));

if (module.hot) {
	module.hot.accept();
}
