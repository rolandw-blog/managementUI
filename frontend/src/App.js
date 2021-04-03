import React from "react";
import Pages from "./components/Pages";
import UploadForm from "./components/uploadForm/UploadForm";
import styled from "styled-components";
import { BrowserRouter, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./components/navigation/navBar";
import ViewPage from "./components/viewPage/ViewPage";
import { theme, Styles, Wrapper } from "./StyleBaseline";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Styles>
				<BrowserRouter basename="/admin">
					{/* <NavBar position="fixed" /> */}
					<Wrapper>
						<Route exact path="/" component={Pages} />
						<Route exact path="/upload" component={UploadForm} />
						<Route exact path="/page/:id" component={ViewPage} />
					</Wrapper>
				</BrowserRouter>
			</Styles>
		</ThemeProvider>
	);
}

export default App;
