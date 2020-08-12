import React from "react";
import { Grid, Paper, Button, IconButton } from "@material-ui/core";
import { AddAPhotoOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
	btn: {
		backgroundColor: "rgba(29,161,242,1.00)",
		color: "white",
		fontWeight: "bold",
		fontSize: "15px",
		marginTop: "0.7rem",
		marginBottom: "0.7rem",
		marginRight: "1rem",
		textTransform: "capitalize",
		"&:hover": {
			backgroundColor: "rgba(29,161,242,1.00)",
		},
		"&:focus": {
			backgroundColor: "rgba(29,161,242,1.00)",
		},
	},
	form: {
		width: "100%",
		height: "27rem",
		display: "flex",
		flexDirection: "column",
		textAlign: "center",
		marginRight: "auto",
		marginLeft: "auto",
		paddingLeft: "8rem",
	},
	input: {
		height: "50px",
		width: "90%",
	},
});

const MusicLibrary = (props) => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Grid justify="center" container spacing={2}>
				{/* <Grid item xs={12}> */}

				<Grid item xs={6}>
					<Paper
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
						square>
						<form className={classes.form} onSubmit={props.onSubmit}>
							<h3 style={{ marginRight: "4rem" }}>Create Playlist</h3>

							<input
								className={classes.input}
								type="text"
								name="name"
								value={props.value}
								onChange={props.onChange}
								placeholder="Playlist's name"
								required
							/>
							<br />
							<Button
								style={{ marginRight: "4rem" }}
								className={classes.btn}
								type="submit">
								Create
							</Button>
						</form>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
						square>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<h3>Upload Playlist Cover image</h3>
							<input
								type="file"
								ref={props.ref}
								onChange={props.onUpload}
								id="contained-button-file"
								name="image"
								accept="image/*"
								style={{ display: "none" }}
							/>
							<label htmlFor="contained-button-file">
								<IconButton aria-label="upload picture" component="span">
									<AddAPhotoOutlined
										style={{
											color: "rgba(29,161,242,1.00)",
											width: "2.5rem",
											height: "2.5rem",
										}}
									/>
								</IconButton>
							</label>
							<div
								style={{
									height: "200px",
									width: "200px",
									border: "1px dashed black",
								}}>
								<img
									ref={props.uploadedImage}
									style={{
										width: "200px",
										height: "200px",
										position: "inherit",
									}}
									alt=""
								/>
							</div>

							<Button
								className={classes.btn}
								onClick={props.updatePlaylistImage}>
								Upload to playlist
							</Button>
						</div>
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
};

export default MusicLibrary;
