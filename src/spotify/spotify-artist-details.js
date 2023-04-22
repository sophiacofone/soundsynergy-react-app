import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getArtist, getArtistAlbums, getArtistTopTracks} from "./spotify-service";
import {useSelector} from "react-redux";


function SpotifyArtistDetailsScreen() {

    const {id} = useParams();
    const [artist, setArtist] = useState({});
    const [artistAlbum, setArtistAlbum] = useState({});
    const [artistTopTracks, setArtistTopTracks] = useState({});

    const fetchArtist = async () => {
        const response = await getArtist(id);
        setArtist(response);
    };
    const fetchArtistAlbums = async () => {
        const response = await getArtistAlbums(id);
        setArtistAlbum(response);
    }
    const fetchArtistTopTracks = async () => {
        const response = await getArtistTopTracks(id);
        setArtistTopTracks(response);
    }

    useEffect(() => {
        fetchArtist();
        fetchArtistAlbums();
        fetchArtistTopTracks();
    }, []);

    const genre_list = artist.genres

    return (
        <div>
            <div className="container m-3">
                <div className="row">
                    <div className="col-md-6 offset-md-4">
                        <div className="card">
                            <h6 className="card-header">Details: {artist.name} Artist</h6>
                            <img
                                src={(artist.images?.length ?? 0) > 0 ? artist.images[0].url : ""}
                                className="card-img-top"
                                alt={artist.name}
                            />
                            <div className="card-body">
                                <div>
                                    <strong> Artist Followers:</strong> {artist.followers?.total ?? "N/A"}
                                </div>
                                <div>
                                    <strong> Artist Populatiry:</strong> {artist.popularity}%
                                </div>
                            </div>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne" aria-expanded="true"
                                                aria-controls="collapseOne">
                                            Genres
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show"
                                         aria-labelledby="headingOne"
                                         data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <ul className="list-group">
                                                {genre_list && genre_list.length > 0 ? (
                                                    <ul className="list-group">
                                                        {genre_list.map((genre, index) => (
                                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <h6>{genre}</h6>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo" aria-expanded="false"
                                                aria-controls="collapseTwo">
                                            Albums
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse"
                                         aria-labelledby="headingTwo"
                                         data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            {Array.isArray(artistAlbum) && artistAlbum.map((album) => (
                                                <li key={album.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <h6>
                                                        <Link to={`/spotify/album/${album.id}`}>{album.name}</Link>
                                                    </h6>
                                                </li>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree" aria-expanded="false"
                                                aria-controls="collapseThree">
                                            Top Tracks
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse"
                                         aria-labelledby="headingThree"
                                         data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            {Array.isArray(artistTopTracks.tracks) && artistTopTracks.tracks.map((track) => (
                                                <li key={track.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <h6>
                                                        <Link to={`/spotify/track/${track.id}`}>{track.name}</Link>
                                                    </h6>
                                                </li>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">link to save</li>
                                <li className="list-group-item">friend analysis?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotifyArtistDetailsScreen;
