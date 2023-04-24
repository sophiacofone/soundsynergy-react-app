import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getTrack } from "./spotify-service";
import { useSelector } from "react-redux";
import {findLikesByUserId, userLikesTrack, userUnlikesTrack} from "./likes-service";

function SpotifyTrackDetailsScreen() {
    const { currentUser } = useSelector((state) => state.users);
    const { id } = useParams();

  const [track, setTrack] = useState({});
  const [isLiked, setIsLiked] = useState(false);

  const likeTrack = async () => {
    const response = await userLikesTrack(currentUser._id, id, track.name, track.album.images[0].url);
    setIsLiked(true);
  };
  const unlikeTrack = async () => {
    const response = await userUnlikesTrack(currentUser._id, id);
    setIsLiked(false);
  };

  const checkUserLikedTrack = async () => {
    if (currentUser) {
      const likes = await findLikesByUserId(currentUser._id);
      const artistLike = likes.find((like) => like.type === 'track' && like.musicThingId === id);
      setIsLiked(Boolean(artistLike));
    }
  };

  const fetchTrack = async () => {
    const response = await getTrack(id);
    setTrack(response);
  };
  useEffect(() => {
    fetchTrack();
    checkUserLikedTrack();
  }, [currentUser, id]);

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
                  <div className="row">
                    <div className="col-9">
                      <div>
                        <strong> Artist:</strong>{" "}
                        <Link to={`/search/artist/${track.artists && track.artists.length ? track.artists[0].id : ''}`}>
                          {track.artists && track.artists.length ? track.artists[0].name : 'N/A'}
                        </Link>
                      </div>
                      <div>
                        <strong> Album Name:</strong>{" "}
                        <Link to={`/search/album/${track.album?.id}`}>
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
                    <div className="col-3">
                      {currentUser && (
                          isLiked ? (
                              <button onClick={unlikeTrack} className="btn btn-sm btn-danger">Dislike</button>
                          ) : (
                              <button onClick={likeTrack} className="btn btn-sm btn-success">Like</button>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">friend analysis?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default SpotifyTrackDetailsScreen;

