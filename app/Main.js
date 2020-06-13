import React, { useState, useReducer } from "react";
import ReactDom from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";

// setting-universal-url-to-backend
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "../app/context/StateContext";
import DispatchContext from "../app/context/DispatchContext";

import Header from "./components/Header";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem("social-app-token")),
		flashMessages: [],
	};
	function ourReducer(draft, action) {
		switch (action.type) {
			case "login":
				draft.loggedIn = true;
				return;
			case "logout":
				draft.loggedIn = false;
				return;
			case "flashMessage":
				draft.flashMessages.push(action.value);
				return;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Switch>
						<Route path="/" exact>
							{state.loggedIn ? <Home /> : <HomeGuest />}
						</Route>
						<Route path="/post/:id">
							<ViewSinglePost />
						</Route>
						<Route path="/create-post">
							<CreatePost />
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
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

ReactDom.render(<Main />, document.querySelector("#app"));

if (module.hot) {
	module.hot.accept();
}
