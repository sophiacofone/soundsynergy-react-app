import React, { useState } from "react";
import { searchTracks, searchArtists, searchAlbums } from "./spotify-service";
import {Link} from "react-router-dom";

function SpotifySearchComponent() {
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("track");
    const [displaySearchType, setDisplaySearchType] = useState("track");
    const [displayResults, setDisplayResults] = useState([]);
    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };
    const handleSearch = async () => {
        let response;
        switch (searchType) {
            case "artist":
                response = await searchArtists(search);
                break;
            case "album":
                response = await searchAlbums(search);
                break;
            default:
                response = await searchTracks(search);
                break;
        }
        setDisplayResults(response);
        setDisplaySearchType(searchType);
    };
    return (
            <div>
                <h1>Spotify Search</h1>
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control mr-2"
                        placeholder="Search..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <select
                        className="form-control"
                        value={searchType}
                        onChange={handleSearchTypeChange}
                    >
                        <option value="track">Tracks</option>
                        <option value="artist">Artists</option>
                        <option value="album">Albums</option>
                    </select>
                    <button className="btn btn-primary ml-2" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            {displaySearchType === "track" && (
                <div>
                    <h2>Tracks</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((track) => (
                                        <td key={track.id}>
                                            <div className="card">
                                                <h6 className="card-header">{track.name}</h6>
                                                <img
                                                    src={(track.album.images?.length ?? 0) > 0 ? track.album.images[0].url : ""}
                                                    className="card-img-top"
                                                    style={{ width: "12rem", height: "12rem" }}
                                                    alt={track.name}
                                                />
                                                <div className="card-body">
                                                    Album: {track.album?.name ?? "N/A"}
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item">link</li>
                                                    <li className="list-group-item">link</li>
                                                </ul>
                                            </div>
                                        </td>
                                    ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {displaySearchType === "artist" && (
                <div>
                    <h2>Artists</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((artist) => (
                                        <td key={artist.id}>
                                            <div className="card">
                                                <h6 className="card-header">{artist.name}</h6>
                                                <img
                                                    src={(artist.images?.length ?? 0) > 0 ? artist.images[0].url : ""}
                                                    className="card-img-top"
                                                    style={{ width: "12rem", height: "12rem" }}
                                                    alt={artist.name}
                                                />
                                                <div className="card-body">
                                                    Followers: {artist.followers?.total ?? "N/A"}
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item">link</li>
                                                    <li className="list-group-item">link</li>
                                                </ul>
                                            </div>
                                        </td>
                                    ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {displaySearchType === "album" && (
                <div>
                    <h2>Albums</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((album) => (
                                        <td key={album.id}>
                                            <div className="card">
                                                <h6 className="card-header">{album.name}</h6>
                                                <img
                                                    src={(album.images?.length ?? 0) > 0 ? album.images[0].url : ""}
                                                    className="card-img-top"
                                                    style={{ width: "12rem", height: "12rem" }}
                                                    alt={album.name}
                                                />
                                                <div className="card-body">
                                                    Release date: {album.release_date ?? "N/A"}
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item">link</li>
                                                    <li className="list-group-item">link</li>
                                                </ul>
                                            </div>
                                        </td>
                                    ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
export default SpotifySearchComponent;