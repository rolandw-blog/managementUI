import React, { useEffect, useState } from "react";
import Dropdown from "../dropdowns/Dropdown";
import { Button } from "@material-ui/core";
import "../../styles/styles.scss";
import Edit from "../Fields/Edit";
import {
	sourceSaveButtonHandler,
	sourceUndoButtonHandler,
	sourceAddButtonHandler,
	sourceDeleteButtonHandler,
} from "../fieldCallbacks/sourceDropdownCallbacks";

import {
	modalSaveButtonCallback,
	modalUndoButtonHandler,
} from "../fieldCallbacks/modalFieldCallbacks";

import PageEditField from "../pageEditField/PageEditField";
import Field from "../Fields/Field";
import SourceFields from "./modalSourceFields";
// callback to update the main fields

const deletePageHandler = async (_id) => {
	const postURL = `/api/v1/watch/delete/${_id}`;
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	};
	const result = await (await fetch(postURL, options)).json();
	return result;
};

const notImplemented = (functionName) => {
	return "Function not implemented";
};

export default function Model(props) {
	const [open, setOpen] = useState(false);
	const [fields, setFields] = useState([]);
	const [source, setSource] = useState([]);
	const { _id } = props.data.original;

	async function handleModal() {
		// a template that defines each field to load in
		const formFields = [
			{
				title: "ID",
				fieldName: "_id",
				value: props._id,
				disabled: true,
			},
			{
				title: "Page Name",
				fieldName: "pageName",
				value: props.pageName,
				disabled: false,
			},
			{
				title: "Website Path",
				fieldName: "websitePath",
				value: props.websitePath,
				disabled: false,
			},
			{
				title: "Hidden",
				fieldName: "hidden",
				value: props.hidden,
				disabled: false,
			},
			{
				title: "Revision",
				fieldName: "__v",
				value: props.__v,
				history: props.history,
				disabled: true,
			},
		];

		// if the modal is opening load in the fields for it
		if (open) {
			setFields([]);
			const fields = formFields.map((field, i) => {
				return (
					<Field
						_id={_id}
						initialMode={"display"}
						value={field.value}
						title={field.title}
						fieldName={field.fieldName}
						disabled={field.disabled}
						key={_id + i}
						saveButtonCallback={modalSaveButtonCallback}
						editButtonCallback={notImplemented}
						closeButtonCallback={notImplemented}
						onChangeCallback={notImplemented}
						deleteButtonCallback={notImplemented}
						undoButtonCallback={modalUndoButtonHandler}
					/>
				);
			});
			setFields(fields);
		}
	}

	// when the modal is opened refresh the field data
	useEffect(() => {
		handleModal();
	}, [open]);

	return (
		<>
			{/* open the modal button */}
			<button
				className="button is-dark"
				key={props.cellID}
				onClick={() => {
					setOpen(true);
				}}
			>
				Edit
			</button>

			{/* Modal wrapper */}
			<div className={`modal ${open ? "is-active" : ""} `}>
				{/* Dim background */}
				<div
					className="modal-background"
					onClick={() => {
						setOpen(false);
					}}
				></div>

				{/* Modal card */}
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">{props.pageName}</p>
						{/* top right close */}
						<button
							className="delete"
							aria-label="close"
							onClick={() => {
								setOpen(false);
							}}
						></button>
					</header>
					<section className="modal-card-body">
						{/* print out every form field for this modal */}
						{fields.map((f) => f)}
						<Dropdown title="test">
							<SourceFields open={open} _id={_id}></SourceFields>
						</Dropdown>
					</section>
					<footer className="modal-card-foot">
						<Button
							variant="contained"
							type="submit"
							color="primary"
							disabled={false}
							onClick={async () => {
								await deletePageHandler(_id);
								setOpen(false);
							}}
						>
							Delete
						</Button>
					</footer>
				</div>
				{/* End modal card */}
			</div>
			{/* End modal wrapper */}
		</>
	);
}
