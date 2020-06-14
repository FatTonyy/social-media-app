import React, { useEffect } from "react";
import Container from "./Container";

export default function Page(props) {
	useEffect(() => {
		document.title = `${props.title} | SocialApp`;
		window.scrollTo(0, 0);
	}, [props.title]);
	return <Container>{props.children}</Container>;
}
