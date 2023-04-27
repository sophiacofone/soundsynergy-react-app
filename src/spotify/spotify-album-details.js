import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAlbumTracks, getAlbum } from "./spotify-service";
import { userLikesAlbum, userUnlikesAlbum, findLikesByUserId } from "./likes-service";
import ShareButton from "../components/share-button";
import {findFriendsByUser} from "../services/friends-service";
import {findUserById} from "../services/users/users-service";
import {userSharesItem} from "../services/shared-service";

function SpotifyAlbumDetailsScreen() {
  const { currentUser } = useSelector((state) => state.users);

  const { id } = useParams();

  const [tracks, setTracks] = useState([]);
  const [album, setAlbum] = useState({});
  const [isLiked, setIsLiked] = useState(false);

  async function handleShareClick(contentItem) {
    try {
      const friends = await findFriendsByUser(currentUser._id);
      if (friends.length === 0) {
        alert('You have no friends to share this content with.');
        return;
      }

      const validFriends = friends.filter(friend => friend.user1 === currentUser._id || friend.user2 === currentUser._id);
      const randomFriendIndex = Math.floor(Math.random() * validFriends.length);
      const randomFriend = validFriends[randomFriendIndex];
      const friendId = randomFriend.user1 === currentUser._id ? randomFriend.user2 : randomFriend.user1;

      const randomFriendData = await findUserById(friendId);
      const randomFriendName = randomFriendData.username;

      const shareConfirmation = window.confirm(
          `${randomFriendName} would love this content! Share it with them?`
      );

      if (shareConfirmation) {
        userSharesItem(
            currentUser._id,
            friendId,
            contentItem.type,
            contentItem.musicThingId,
            contentItem.name
        )
            .then(() => {
              alert('Content shared successfully.');
            })
            .catch((error) => {
              console.error('Error sharing content:', error);
              alert('An error occurred while sharing content.');
            });
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      alert('An error occurred while fetching friends.');
    }
  }
  const likeAlbum = async () => {
    const response = await userLikesAlbum(currentUser._id, id, album.name, album.images[0].url, album.genres);
    setIsLiked(true);
  };
  const unlikeAlbum = async () => {
    const response = await userUnlikesAlbum(currentUser._id, id);
    setIsLiked(false);
  };
  const checkUserLikedAlbum = async () => {
    if (currentUser) {
      const likes = await findLikesByUserId(currentUser._id);
      const albumLike = likes.find((like) => like.type === 'album' && like.musicThingId === id);
      setIsLiked(Boolean(albumLike));
    }
  };

  const fetchAlbum = async () => {
    const response = await getAlbum(id);
    setAlbum(response);
  };
  const fetchTracks = async () => {
    const response = await getAlbumTracks(id);
    setTracks(response);
  };

  useEffect(() => {
    fetchTracks();
    fetchAlbum();
    checkUserLikedAlbum();
  }, [currentUser, id]);

  return (
    <div>
      <div className="container m-3">
        <div className="row">
            <div className="col-md-6 offset-md-4">
              <div className="card">
                <h6 className="card-header">Details: {album.name} Album</h6>
                <img
                    src={(album.images?.length ?? 0) > 0 ? album.images[0].url : ""}
                    className="card-img-top"
                    alt={album.name}
                />
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div>
                        <strong> Release date: </strong>{
                        album.release_date ?
                            new Date(album.release_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
                            "N/A"
                      }
                      </div>
                      <div>
                        <strong> Album Type:</strong> {album.album_type}
                      </div>
                      <div>
                        <strong> Album Populatiry:</strong> {album.popularity}%
                      </div>
                    </div>
                    <div className="col-3">
                      {currentUser && (
                          isLiked ? (
                              <div>
                                <button onClick={unlikeAlbum} className="btn btn-sm btn-danger">Dislike</button>
                                <ShareButton
                                    onClick={() =>
                                        handleShareClick({
                                          type: "album",
                                          musicThingId: album.id,
                                          name: album.name,
                                        })
                                    }
                                />
                              </div>
                          ) : (
                              <button onClick={likeAlbum} className="btn btn-sm btn-success">Like</button>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Tracks
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                         data-bs-parent="#accordionExample">
                      <div className="accordion-body">
                        <ul className="list-group">
                          {tracks.map((track) => (
                              <li key={track.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <h6>
                                  <Link to={`/search/track/${track.id}`}>{track.name}</Link>
                                </h6>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Artists
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                         data-bs-parent="#accordionExample">
                      <div className="accordion-body">
                        <ul className="list-group">
                          {Array.isArray(album.artists) && album.artists.map((artist) => (
                              <li key={artist.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <h6>
                                  <Link to={`/search/artist/${artist.id}`}>{artist.name}</Link>
                                </h6>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyAlbumDetailsScreen;
