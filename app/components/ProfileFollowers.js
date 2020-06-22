import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

export default function ProfileFollowers() {
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/followers`, {
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
			{posts.map((follower, index) => {
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
		</div>
	);
}
