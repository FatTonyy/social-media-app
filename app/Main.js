import React from "react";
import ReactDom from "react-dom";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";

function Main() {
	return (
		<BrowserRouter>
			<Header />
			<Switch>
				<Route path="/" exact>
					{" "}
					<HomeGuest />
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
