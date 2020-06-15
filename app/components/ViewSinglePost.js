import React, { useState, useEffect } from "react";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactToolTip from "react-tooltip";

export default function ViewSinglePost() {
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState();
	const { id } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchSinglePost() {
			try {
				const response = await Axios.get(`/post/${id}`, {
					CancelToken: ourRequest.token,
				});
				setPost(response.data);
				setIsLoading(false);
			} catch (e) {
				console.log("there was a problem");
			}
		}
		fetchSinglePost();

		return () => ourRequest.cancel();
	}, []);

	if (isLoading) {
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		);
	}

	const date = new Date(post.createdDate);
	const dateFormatted = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`;

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				<span className="pt-2">
					<Link
						to={`/post/${post._id}/edit`}
						data-tip="Edit"
						data-for="edit"
						className="text-primary mr-2"
					>
						<i className="fas fa-edit"></i>
					</Link>
					<ReactToolTip id="edit" className="custom-tooltip" />{" "}
					<a
						data-tip="Delete"
						data-for="delete"
						className="delete-post-button text-danger"
					>
						<i className="fas fa-trash"></i>
					</a>
					<ReactToolTip id="delete" className="custom-tooltip" />
				</span>
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img className="avatar-tiny" src={post.author.avatar} />
				</Link>
				Posted by{" "}
				<Link to={`/profile/${post.author.username}`}>
					{post.author.username}
				</Link>{" "}
				on {dateFormatted}
			</p>

			<div className="body-content">
				<ReactMarkdown
					source={post.body}
					// allowedTypes={[
					// 	"paragraphs",
					// 	"strong",
					// 	"emphasis",
					// 	"text",
					// 	"heading",
					// 	"list",
					// 	"listItem",
					// ]}
				/>
			</div>
		</Page>
	);
}
