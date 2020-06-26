import React, { useEffect, Suspense } from "react";
import ReactDom from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

// setting-universal-url-to-backend
Axios.defaults.baseURL =
	process.env.BACKENDURL || "https://social-app-gh.herokuapp.com";

import StateContext from "../app/context/StateContext";
import DispatchContext from "../app/context/DispatchContext";

import LoadingDotsIcon from "./components/LoadingDotsIcon";
import Header from "./components/Header";
import Home from "./components/Home";
// integrating-lazy-loading-into-react
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem("social-app-token")),
		flashMessages: [],
		user: {
			token: 'localStorage.getItem("social-app-token")',
			username: 'localStorage.getItem("social-app-username")',
			avatar: 'localStorage.getItem("social-app-avatar")',
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadChatCount: 0,
	};
	function ourReducer(draft, action) {
		switch (action.type) {
			case "login":
				draft.loggedIn = true;
				draft.user = action.data;
				return;
			case "logout":
				draft.loggedIn = false;
				return;
			case "flashMessage":
				draft.flashMessages.push(action.value);
				return;
			case "openSearch":
				draft.isSearchOpen = true;
				return;
			case "closeSearch":
				draft.isSearchOpen = false;
				return;
			case "toggleChat":
				draft.isChatOpen = !draft.isChatOpen;
				return;
			case "closeChat":
				draft.isChatOpen = false;
				return;
			case "incrementUnreadChatCount":
				draft.unreadChatCount++;
				return;
			case "clearUnreadChatCount":
				draft.unreadChatCount = 0;
				return;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	// persisting data from state and not localStorage
	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("social-app-token", state.user.token);
			localStorage.setItem("social-app-username", state.user.username);
			localStorage.setItem("social-app-avatar", state.user.avatar);
		} else {
			localStorage.removeItem("social-app-token");
			localStorage.removeItem("social-app-username");
			localStorage.removeItem("social-app-avatar");
		}
	}, [state.loggedIn]);

	// Check to see if token has expired or not on first render
	useEffect(() => {
		if (state.loggedIn) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResults() {
				try {
					const response = await Axios.post(
						`/checkToken`,
						{ token: state.user.token },
						{ cancelToken: ourRequest.token }
					);
					if (!response.data) {
						dispatch({ type: "logout" });
						dispatch({
							type: "flashMessage",
							value: "Your session has expired, please log in again",
						});
					}
				} catch (e) {
					console.log("the request was cancelled");
				}
			}
			fetchResults();
			return () => ourRequest.cancel();
		}
	}, []);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Suspense fallback={<LoadingDotsIcon />}>
						<Switch>
							<Route path="/profile/:username">
								<Profile />
							</Route>
							<Route path="/" exact>
								{state.loggedIn ? <Home /> : <HomeGuest />}
							</Route>
							<Route path="/post/:id" exact>
								<ViewSinglePost />
							</Route>
							<Route path="/post/:id/edit" exact>
								<EditPost />
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
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</Suspense>
					<CSSTransition
						timeout={330}
						in={state.isSearchOpen}
						classNames="search-overlay"
						unmountOnExit
					>
						<div className="search-overlay">
							<Suspense fallback="">
								<Search />
							</Suspense>
						</div>
					</CSSTransition>
					<Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
