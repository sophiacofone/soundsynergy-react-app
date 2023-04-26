import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getArtist, getArtistAlbums, getArtistTopTracks} from "./spotify-service";
import {useSelector} from "react-redux";
import {findLikesByUserId, userLikesArtist, userUnlikesArtist} from "./likes-service";
import ShareButton from "../components/share-button";
import { userSharesItem } from '../services/shared-service';
import { findFriendsByUser} from "../services/friends-service";
import { findUserById } from "../services/users/users-service";


function SpotifyArtistDetailsScreen() {
    const { currentUser } = useSelector((state) => state.users);

    const { id } = useParams();

    const [artist, setArtist] = useState({});
    const [artistAlbum, setArtistAlbum] = useState({});
    const [artistTopTracks, setArtistTopTracks] = useState({});
    const [isLiked, setIsLiked] = useState(false);


    const likeArtist = async () => {
        const response = await userLikesArtist(currentUser._id, id, artist.name, artist.images[0].url);
        setIsLiked(true);
    };
    const unlikeArtist = async () => {
        const response = await userUnlikesArtist(currentUser._id, id);
        setIsLiked(false);
    };

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

    const checkUserLikedArtist = async () => {
        if (currentUser) {
            const likes = await findLikesByUserId(currentUser._id);
            const artistLike = likes.find((like) => like.type === 'artist' && like.musicThingId === id);
            setIsLiked(Boolean(artistLike));
        }
    };

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
        checkUserLikedArtist();
    }, [currentUser, id]);

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
                                <div className="row">
                                <div className="col-9">
                                <div>
                                    <strong>Artist Followers:</strong>{" "}
                                    {artist.followers?.total
                                        ? artist.followers.total.toLocaleString()
                                        : "N/A"}
                                </div>
                                <div>
                                    <strong> Artist Populatiry:</strong> {artist.popularity}%
                                </div>
                                </div>
                                <div className="col-3">
                                    {currentUser && (
                                        isLiked ? (
                                            <div>
                                                <button onClick={unlikeArtist} className="btn btn-sm btn-danger">Dislike</button>
                                                <ShareButton
                                                    onClick={() =>
                                                        handleShareClick({
                                                            type: "artist",
                                                            musicThingId: artist.id,
                                                            name: artist.name,
                                                        })
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <button onClick={likeArtist} className="btn btn-sm btn-success">Like</button>
                                        )
                                    )}
                                </div>
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
                                                        <Link to={`/search/album/${album.id}`}>{album.name}</Link>
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
                                                        <Link to={`/search/track/${track.id}`}>{track.name}</Link>
                                                    </h6>
                                                </li>
                                            ))}
                                        </div>
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

export default SpotifyArtistDetailsScreen;
