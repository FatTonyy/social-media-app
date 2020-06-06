import React from "react";
import ReactDom from "react-dom";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";

function Main() {
	return (
		<>
			<Header />
			<HomeGuest />
			<Footer />
		</>
	);
}

ReactDom.render(<Main />, document.querySelector("#app"));

if (module.hot) {
	module.hot.accept();
}
