import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getArtist, getTrack} from "./spotify-service";
import {useSelector} from "react-redux";
import {findLikesByUserId, userLikesTrack, userUnlikesTrack} from "./likes-service";
import ShareButton from "../components/share-button";
import {findFriendsByUser} from "../services/friends-service";
import {findUserById} from "../services/users/users-service";
import {userSharesItem} from "../services/shared-service";

function SpotifyTrackDetailsScreen() {
    const {currentUser} = useSelector((state) => state.users);
    const {id} = useParams();

    const [track, setTrack] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [genre, setGenre] = useState("");

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

    const likeTrack = async () => {
        const response = await userLikesTrack(currentUser._id, id, track.name, track.album.images[0].url, genre);
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
        let artistId = "";
        if (response.artists && response.artists.length > 0) {
             artistId = response.artists[0].id;
            const artist = await getArtist(artistId);
            const genres = artist.genres;
            setGenre(genres);
        }
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
                                            <Link
                                                to={`/search/artist/${track.artists && track.artists.length ? track.artists[0].id : ''}`}>
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
                                                <div>
                                                    <button onClick={unlikeTrack}
                                                            className="btn btn-sm btn-danger">Dislike
                                                    </button>
                                                    <ShareButton
                                                        onClick={() =>
                                                            handleShareClick({
                                                                type: "track",
                                                                musicThingId: track.id,
                                                                name: track.name,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <button onClick={likeTrack}
                                                        className="btn btn-sm btn-success">Like</button>
                                            )
                                        )}
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

export default SpotifyTrackDetailsScreen;

