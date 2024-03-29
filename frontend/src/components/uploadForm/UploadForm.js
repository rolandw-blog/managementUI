import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Container, Paper } from "@material-ui/core";
import { Fieldset, FormWrapper, SubmitWrapper } from "./UploadForm.styles";
import { useStyles } from "../formikComponents/MUIStyles";
import MyTextInput from "../formikComponents/Input";
import MyCheckbox from "../formikComponents/Checkbox";
import MySelect from "../formikComponents/Option";
import SourcesSection from "../formikComponents/fieldArray";

// {
//     "pageName": "testPage",
//     "source": [{"remote": true, "url": "a.com"}],
//     "websitePath": "/deleteMe",
//     "hidden": false,
//     "meta": {"template": "blogPost.ejs"}
// }

const submitHandler = async ({ pageName, websitePath, hidden, source, meta }) => {
	const postURL = `/api/v1/watch/upload`;

	// theres no support for electing a page as "not remote" right now
	// this is just a hack to make it play nice by adding the {remote: true} field to each page source
	for (let s of source) {
		if (s) s.remote = true;
	}

	const body = { pageName, websitePath, hidden, source, meta };

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};

	return await fetch(postURL, options).then((res) => {
		return res.json();
	});
};

const SignupForm = () => {
	const classes = useStyles();

	const [submitResult, setSubmitResult] = useState({
		success: false,
		message: "please wait",
	});

	return (
		<Container className={classes.root} maxWidth="md">
			<Paper elevation={3} elementtype="section">
				<Formik
					initialValues={{
						pageName: "",
						websitePath: "",
						hidden: false, // added for our checkbox
						source: [{ url: "" }],
						meta: { template: "" },
					}}
					validateOnChange={false}
					validateOnBlur={false}
					validationMount={false}
					// validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(async () => {
							// alert(JSON.stringify(values, null, 2));
							const result = await submitHandler(values);
							// alert(JSON.stringify(result));

							// if its a valid result the blogwatcher should return the saved object
							// store the saved object in submitResult to print a success message
							if (result instanceof Object) {
								setSubmitResult(result);
							}

							setSubmitting(false);
						}, 400);
					}}
					handleChange={(event) => {
						console.log("alert!");
					}}
				>
					{({ values, submitCount, isSubmitting }) => {
						return (
							<FormWrapper>
								<Form>
									<h1>Add page</h1>
									<Fieldset>
										{/* page name */}
										<MyTextInput
											label="Page Name"
											name="pageName"
											type="text"
											placeholder="page name"
										/>

										{/* website path */}
										<MyTextInput
											label="Website Path"
											name="websitePath"
											type="text"
											placeholder="website path"
										/>
									</Fieldset>

									<Fieldset>
										<SourcesSection></SourcesSection>
									</Fieldset>

									{/* page hidden */}
									<Fieldset>
										<MyCheckbox
											// the form control (name)
											name="hidden"
											// what is displayed on the page (label)
											label="hidden"
										>
											Hide page
										</MyCheckbox>
									</Fieldset>

									{/* template dropdown */}
									<Fieldset>
										<MySelect label="Template" name="meta.template">
											<option value="">Select a template</option>
											<option value="blogPost.ejs">blogPost.ejs</option>
											<option value="menu.ejs">menu.ejs</option>
											<option value="homePage.ejs">homePage.ejs</option>
										</MySelect>
									</Fieldset>

									{/* submit */}
									<SubmitWrapper>
										{/* if nothing has been submitted yet show the submit button */}

										{/* if nothing submitted yet */}
										<Button
											variant="contained"
											type="submit"
											color="primary"
											disabled={isSubmitting}
										>
											Submit
										</Button>
									</SubmitWrapper>

									<Paper elevation={3}>
										<pre>
											<code>
												{submitCount === 0
													? // print the payload
													  JSON.stringify(values, "\n", 4)
													: // print the server response
													  JSON.stringify(submitResult, null, 4)}
											</code>
										</pre>
									</Paper>
								</Form>
							</FormWrapper>
						);
					}}
				</Formik>
			</Paper>
		</Container>
	);
};

export default SignupForm;
