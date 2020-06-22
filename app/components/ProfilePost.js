import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

export default function ProfilePost() {
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, {
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
				posts.map((post) => {
					return <Post noAuthor={true} post={post} key={post._id} />;
				})}
			{posts.length == 0 && appState.user.username == username && (
				<p className="lead text-muted text-center">
					You haven&rsquo;t created any posts yet;{" "}
					<Link to="/create-post">create one now!</Link>
				</p>
			)}
			{posts.length == 0 && appState.user.username != username && (
				<p className="lead text-muted text-center">
					{username} hasn&rsquo;t created any posts yet.
				</p>
			)}
		</div>
	);
}
