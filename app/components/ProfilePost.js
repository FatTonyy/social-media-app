import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

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
			{posts.map((post) => {
				const date = new Date(post.createdDate);
				const dateFormatted = `${
					date.getMonth() + 1
				}/${date.getDate()}/${date.getFullYear()}`;

				return (
					<Link
						key={post._id}
						to={`/post/${post._id}`}
						className="list-group-item list-group-item-action"
					>
						<img className="avatar-tiny" src={post.author.avatar} />{" "}
						<strong>{post.title}</strong>{" "}
						<span className="text-muted small">on {dateFormatted} </span>
					</Link>
				);
			})}
		</div>
	);
}
