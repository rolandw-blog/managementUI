import React, { useState, useEffect } from "react";
import Wrapper from "./components/Wrapper";
import Form from "./Form";

const unloadedPage = {
	_id: "waiting",
	pageName: "waiting",
	source: [{ url: "waiting", remote: true }],
	websitePath: ["waiting"],
	__v: 0,
	meta: { template: "waiting" },
};

export default function ViewPage(props) {
	const _id = props.match.params.id;

	const [page, setPage] = useState(unloadedPage);
	const [initialPage, setInitialPage] = useState(undefined);
	const [loading, setLoading] = useState(true);

	// ##──── on load ───────────────────────────────────────────────────────────────────────────
	useEffect(() => {
		// prepend the URL base if in development.
		// This fixes storybook components that need to fetch from APIs and stuff
		const urlBase = process.env.NODE_ENV ? "https://localhost.com" : "";
		const url = `${urlBase}/api/v1/watch/page?_id=${_id}`;

		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setPage({ ...data[0] });
				setInitialPage({ ...data[0] });
				return data;
			});
	}, [_id]);

	return (
		<Wrapper>
			<Form loading={loading} page={page} initialPage={initialPage} />
		</Wrapper>
	);
}
