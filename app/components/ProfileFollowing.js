import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../context/StateContext";

export default function ProfileFollowing() {
	const appState = useContext(StateContext);
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/following`, {
					CancelToken: ourRequest.token,
				});
				setPosts(response.data);
				setIsLoading(false);
			} catch (e) {
				console.log("there was a problem or the request was cancelled");
			}
		}
		fetchPosts();

		return () => ourRequest.cancel();
	}, [username]);

	if (isLoading)
		return (
			<div>
				<LoadingDotsIcon />
			</div>
		);

	return (
		<div className="list-group">
			{posts.length > 0 &&
				posts.map((follower, index) => {
					return (
						<Link
							key={index}
							to={`/profile/${follower.username}`}
							className="list-group-item list-group-item-action"
						>
							<img className="avatar-tiny" src={follower.avatar} />{" "}
							{follower.username}
						</Link>
					);
				})}
			{posts.length == 0 && appState.user.username == username && (
				<p className="lead text-muted text-center">
					You aren&rsquo;t following anyone yet.
				</p>
			)}
			{posts.length == 0 && appState.user.username != username && (
				<p className="lead text-muted text-center">
					{username} isn&rsquo;t following anyone yet.
				</p>
			)}
		</div>
	);
}
