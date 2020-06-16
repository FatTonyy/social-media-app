import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

export default function ViewSinglePost() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	// Initial-state-for-the-reducer{object}
	const initialState = {
		title: {
			value: "",
			hasErrors: false,
			message: "",
		},
		body: {
			value: "",
			hasErrors: false,
			message: "",
		},
		isFetching: true,
		isSaving: false,
		id: useParams().id,
		sendCount: 0,
	};
	// function-for-the-reducer
	function ourReducer(draft, action) {
		switch (action.type) {
			case "fetchComplete":
				draft.title.value = action.value.title;
				draft.body.value = action.value.body;
				draft.isFetching = false;
				return;
			case "titleChange":
				draft.title.value = action.value;
				return;
			case "bodyChange":
				draft.body.value = action.value;
				return;
			case "submitRequest":
				draft.sendCount++;
				return;
			case "saveRequestStarted":
				draft.isSaving = true;
				return;
			case "saveRequestFinished":
				draft.isSaving = false;
				return;
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	// function for submitting-forms
	function submitHandler(e) {
		e.preventDefault();
		dispatch({ type: "submitRequest" });
	}

	//! this use Effect is used to get data from the db
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchSinglePost() {
			try {
				const response = await Axios.get(`/post/${state.id}`, {
					CancelToken: ourRequest.token,
				});
				dispatch({ type: "fetchComplete", value: response.data });
			} catch (e) {
				console.log("there was a problem");
			}
		}
		fetchSinglePost();

		return () => ourRequest.cancel();
	}, []);

	//! this will send a post request to save update in the db
	useEffect(() => {
		if (state.sendCount) {
			dispatch({ type: "saveRequestStarted" });
			const ourRequest = Axios.CancelToken.source();
			async function fetchSinglePost() {
				try {
					const response = await Axios.post(
						`/post/${state.id}/edit`,
						{
							title: state.title.value,
							body: state.body.value,
							token: appState.user.token,
						},
						{
							CancelToken: ourRequest.token,
						}
					);
					dispatch({ type: "saveRequestFinished" });
					appDispatch({ type: "flashMessage", value: "Post was updated" });
				} catch (e) {
					console.log("there was a problem");
				}
			}
			fetchSinglePost();
			return () => ourRequest.cancel();
		}
	}, [state.sendCount]);

	if (state.isFetching) {
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		);
	}

	return (
		<Page title="Edit Post">
			<form onSubmit={submitHandler}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input
						onChange={(e) =>
							dispatch({ type: "titleChange", value: e.target.value })
						}
						value={state.title.value}
						autoFocus
						name="title"
						id="post-title"
						className="form-control form-control-lg form-control-title"
						type="text"
						placeholder=""
						autoComplete="off"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="post-body" className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea
						name="body"
						id="post-body"
						className="body-content tall-textarea form-control"
						type="text"
						value={state.body.value}
						onChange={(e) =>
							dispatch({ type: "bodyChange", value: e.target.value })
						}
					/>
				</div>
				<button className="btn btn-primary" disabled={state.isSaving}>
					Save Updates
				</button>
			</form>
		</Page>
	);
}
