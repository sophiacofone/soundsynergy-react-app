import React, { useState } from "react";
import { searchTracks, searchArtists, searchAlbums } from "./spotify-service";
import { Link, useParams, useNavigate } from "react-router-dom";

function SpotifySearchComponent() {
    const { searchTerm } = useParams();

    const [search, setSearch] = useState(searchTerm ?? "");
    const [isSearchClicked, setIsSearchClicked] = useState(false);
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
        setIsSearchClicked(true);

    };
    return (
        <div className='container m-2'>
            <div>
                <h1>Spotify Media Search {search !== "" && ` - ${displaySearchType}`}</h1>
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
                    <h2>Search Results for: '{search !== "" && `${search}`}'</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((track) => (
                                        <td key={track.id}>
                                            <Link to={`/search/track/${track.id}`}>
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
                                                </div>
                                            </Link>
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
                    <h2>Search Results for: '{search !== "" && `${search}`}'</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((artist) => (
                                        <td key={artist.id}>
                                            <Link to={`/search/artist/${artist.id}`}>
                                                <div className="card">
                                                    <h6 className="card-header">{artist.name}</h6>
                                                    <img
                                                        src={(artist.images?.length ?? 0) > 0 ? artist.images[0].url : ""}
                                                        className="card-img-top"
                                                        style={{ width: "12rem", height: "12rem" }}
                                                        alt={artist.name}
                                                    />
                                                    <div>
                                                        <strong>Artist Followers:</strong>{" "}
                                                        {artist.followers?.total
                                                            ? artist.followers.total.toLocaleString()
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </Link>
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
                    <h2>Search Results for: '{search !== "" && `${search}`}'</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {displayResults.items &&
                                    displayResults.items.map((album) => (
                                        <td key={album.id}>
                                            <Link to={`/search/album/${album.id}`}>
                                                <div className="card">
                                                    <h6 className="card-header">{album.name}</h6>
                                                    <img
                                                        src={(album.images?.length ?? 0) > 0 ? album.images[0].url : ""}
                                                        className="card-img-top"
                                                        style={{ width: "12rem", height: "12rem" }}
                                                        alt={album.name}
                                                    />
                                                    <div className="card-body">
                                                        <strong> Release date: </strong>{
                                                        album.release_date ?
                                                            new Date(album.release_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
                                                            "N/A"
                                                    }
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                    ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
            {!isSearchClicked && (
                <div className="">
                    <div className="row">
                        <h4>Example results</h4>
                        <div className="col-4">
                            <div className="card">
                                <h6 className="card-header">Raindrops</h6>
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/rain_album_example.jpeg`}
                                    className="card-img-top"
                                    alt="Raindrops album example"
                                />
                                <div className="card-body">Album: Stormtide</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card">
                                <h6 className="card-header">Jojabeats</h6>
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/artist_example.jpeg`}
                                    className="card-img-top"
                                    alt="Raindrops album example"
                                />
                                <div className="card-body">Followers: 1,000</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card">
                                <h6 className="card-header">Stormtide</h6>
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/rain_album_example.jpeg`}
                                    className="card-img-top"
                                    alt="Raindrops album example"
                                />
                                <div className="card-body">Release Date: Oct 2, 2022</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default SpotifySearchComponent;