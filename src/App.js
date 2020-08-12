import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Spotify from "spotify-web-api-js";
import Login from "./Components/Auth";
import MusicLibrary from "./Components/MusicLibrary";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Button } from "@material-ui/core";

const useStyles = makeStyles({
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
});

const SpotifyWebApi = new Spotify();

function App() {
	const classes = useStyles();
	const [name, setName] = React.useState("");
	const [user, setUser] = React.useState(null);
	const [playlist, setPlaylist] = React.useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);
	const [image, setImage] = React.useState();
	const [newRelease, setNewRelease] = React.useState([]);
	const [error, setError] = React.useState("");
	const [success, setSuccess] = React.useState("");
	const uploadedImage = React.useRef(null);
	const imageUploader = React.useRef(null);

	const getHashParams = () => {
		var hashParams = {};
		var e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	};

	React.useEffect(() => {
		const param = getHashParams();
		if (param.access_token) {
			SpotifyWebApi.setAccessToken(param.access_token);
		}

		SpotifyWebApi.getMe().then(
			function (response) {
				setUser(response);
			},
			function (err) {
				setError("Error fetching user", err);
			}
		);
	}, []);

	const createPlayList = () => {
		SpotifyWebApi.createPlaylist(user.id, { name: name }).then(
			function () {
				setSuccess("Succcessfully Created Playlist");
			},
			function (err) {
				setError("Unable to create playlist", err);
			}
		);
	};

	const getUserPlayList = () => {
		SpotifyWebApi.getUserPlaylists(user.id).then(
			function (data) {
				setSuccess("Success");
				setPlaylist(data.items);
			},
			function (err) {
				setError("Failed to retrieve playlist", err);
			}
		);
	};

	const handleImageUpload = (e) => {
		const [file] = e.target.files;
		if (file) {
			const reader = new FileReader();
			const { current } = uploadedImage;
			current.file = file;
			reader.onload = (e) => {
				current.src = e.target.result;
			};
			reader.readAsDataURL(file);
			setImage(image);
		}
	};

	const updatePlaylistImage = () => {
		SpotifyWebApi.uploadCustomPlaylistCoverImage(
			selectedPlaylist.id,
			uploadedImage.current.src
		).then(
			function () {
				setSuccess("Successfully updated");
			},
			function (err) {
				if (selectedPlaylist === null) {
					setError("Select a playlist to be updated");
				}
				setError("Update failed", err);
			}
		);
	};
	const getNewRelease = () => {
		SpotifyWebApi.getNewReleases({ limit: 5 }).then(
			function (data) {
				setNewRelease(data.albums.items);
			},
			function (err) {
				setError("Failed to retrieve albums", err);
			}
		);
	};

	const handleSelect = (trackId) => {
		const select = playlist.find((e) => e.id === trackId);
		setSelectedPlaylist(select);
		if (!select) {
			setError("Not found");
		}
	};

	return (
		<BrowserRouter>
			<Login />
			<MusicLibrary
				onSubmit={(e) => {
					e.preventDefault();
					createPlayList();
				}}
				value={name}
				onChange={(e) => setName(e.target.value)}
				ref={imageUploader}
				onUpload={handleImageUpload}
				uploadedImage={uploadedImage}
				updatePlaylistImage={updatePlaylistImage}
			/>
			{error && (
				<center>
					<h3 style={{ color: "red", backgroundColor: "white" }}>{error}</h3>
				</center>
			)}
			{success && (
				<center>
					<h3 style={{ color: "green", backgroundColor: "white" }}>
						{success}
					</h3>
				</center>
			)}
			<Grid item xs={12}>
				<Paper
					square
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							height: "250px",
							marginTop: "2px",
						}}>
						{playlist.map((track) => {
							return (
								<div key={track.id}>
									<div>Name: {track.name}</div>
									<div>
										<img
											src={track.images[0].url}
											alt=""
											style={{ width: "200px", height: "200px" }}
										/>
									</div>
									<label>Select playlist</label>
									<input
										type="checkbox"
										id={track.id}
										onClick={() => handleSelect(track.id)}
									/>
								</div>
							);
						})}
					</div>

					<Button
						style={{ marginLeft: "2rem" }}
						className={classes.btn}
						onClick={getUserPlayList}>
						Get User's Playlist
					</Button>
				</Paper>
			</Grid>
			<Grid item xs={12}>
				<Paper
					square
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<div
						style={{
							width: "100%",
							height: "250px",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",

							marginTop: "2px",
						}}>
						{newRelease.map((track) => {
							console.log(track);
							return (
								<div key={track.id}>
									<div>
										<b>Title</b>: {track.name}{" "}
									</div>
									<div>
										<img
											src={track.images[0].url}
											style={{ width: "40px", height: "40px" }}
											alt=""
										/>
										<audio controls>
											<source src={track.href} type="audio/mpeg" />
										</audio>
									</div>
								</div>
							);
						})}
					</div>
					<div>
						<Button
							style={{ marginLeft: "2rem" }}
							className={classes.btn}
							onClick={getNewRelease}>
							Get New Releases
						</Button>
					</div>
				</Paper>
			</Grid>
		</BrowserRouter>
	);
}
export default App;
