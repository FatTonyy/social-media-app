import React from "react";
import ReactDom from "react-dom";

function ExampleComponent() {
	return (
		<div>
			<h1>This is our app!!</h1>
			<p>the sky is blue</p>
		</div>
	);
}

ReactDom.render(<ExampleComponent />, document.querySelector("#app"));

if (module.hot) {
	module.hot.accept();
}
