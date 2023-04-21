import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getTrack } from "./spotify-service";
import { useSelector } from "react-redux";

function SpotifyTrackDetailsScreen() {
  const { id } = useParams();
  const [track, setTrack] = useState({});
  const fetchTrack = async () => {
    const response = await getTrack(id);
    setTrack(response);
  };
  useEffect(() => {
    fetchTrack();
  }, []);
  return (
      <div>
        <div className="container m-3">
          <div className="row">
            <div className="col-md-6 offset-md-4">
              <div className="card">
                <h6 className="card-header">Details: {track.name} Track</h6>
                <img
                    src={(track.album?.images?.length ?? 0) > 0 ? track.album.images[0].url : ""}
                    className="card-img-top"
                    alt={track.name}
                />
                <div className="card-body">
                  <div>
                    <strong> Release date:</strong>{" "}
                    {track.album?.release_date ? track.album.release_date : "N/A"}
                  </div>
                  <div>
                    <strong> Artist:</strong>{" "}
                    <Link to={`/spotify/artist/${track.artists && track.artists.length ? track.artists[0].id : ''}`}>
                      {track.artists && track.artists.length ? track.artists[0].name : 'N/A'}
                    </Link>
                  </div>
                  <div>
                    <strong> Album Name:</strong>{" "}
                    <Link to={`/spotify/album/${track.album?.id}`}>
                      {track.album?.name ? track.album?.name : "N/A"}
                    </Link>
                  </div>
                  <div>
                    <strong> Album Type:</strong>{" "}
                    {track.album?.album_type ? track.album?.album_type : "N/A"}
                  </div>
                  <div>
                    <strong> Track Popularity:</strong>{" "}
                    {track.popularity ? track.popularity + "%" : "N/A"}
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
        <h1>{track.name}</h1>
      </div>
  );
}

export default SpotifyTrackDetailsScreen;

