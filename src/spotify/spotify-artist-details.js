import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getArtist, getArtistAlbums, getArtistTopTracks} from "./spotify-service";
import {useSelector} from "react-redux";
import {findLikesByUserId, userLikesArtist, userUnlikesArtist, findGenresByUserId} from "./likes-service";
import ShareButton from "../components/share-button";
import { userSharesItem } from '../services/shared-service';
import { findFriendsByUser} from "../services/friends-service";
import { findUserById } from "../services/users/users-service";

function SpotifyArtistDetailsScreen() {
    const { currentUser } = useSelector((state) => state.users);

    const { id } = useParams();

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const [artist, setArtist] = useState({});
    const [artistAlbum, setArtistAlbum] = useState({});
    const [artistTopTracks, setArtistTopTracks] = useState({});
    const [isLiked, setIsLiked] = useState(false);

    const likeArtist = async () => {
        const response = await userLikesArtist(currentUser._id, id, artist.name, artist.images[0].url, artist.genres);
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

            const validFriends = friends.filter(
                (friend) => friend.user1 === currentUser._id || friend.user2 === currentUser._id
            );

            const currentUserGenres = await findGenresByUserId(currentUser._id);

            let friendToShareWith = null;

            // New variables to store friend counts
            let totalFriendCount = validFriends.length;
            let commonGenreFriendCount = 0;

            for (const friend of validFriends) {
                const friendId = friend.user1 === currentUser._id ? friend.user2 : friend.user1;
                const friendGenres = await findGenresByUserId(friendId);

                const commonGenres = currentUserGenres.filter((genre) => friendGenres.includes(genre));

                if (commonGenres.length > 0) {
                    friendToShareWith = friend;
                    commonGenreFriendCount++; // Increment count for friends with common genres
                    break;
                }
            }

            if (!friendToShareWith) {
                const randomFriendIndex = Math.floor(Math.random() * validFriends.length);
                friendToShareWith = validFriends[randomFriendIndex];
            }

            const friendId = friendToShareWith.user1 === currentUser._id ? friendToShareWith.user2 : friendToShareWith.user1;
            const randomFriendData = await findUserById(friendId);
            const randomFriendName = randomFriendData.username;

            const shareConfirmation = window.confirm(
                `You have ${totalFriendCount} friends, and of those friends ${commonGenreFriendCount} would like this content. 
                ${randomFriendName} would like it the most, Share it with them?`
            );

            if (shareConfirmation) {
                await userSharesItem(
                    currentUser._id,
                    friendId,
                    contentItem.type,
                    contentItem.musicThingId,
                    contentItem.name
                );
                alert('Content shared successfully.');
            }

            return {
                totalFriendCount,
                commonGenreFriendCount,
            };
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
                <button className="btn btn-secondary" onClick={handleBackClick}>
                    Back
                </button>
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
                                                {currentUser.role === "USER" ? (
                                                <ShareButton
                                                    onClick={() =>
                                                        handleShareClick({
                                                            type: "artist",
                                                            musicThingId: artist.id,
                                                            name: artist.name,
                                                        })
                                                    }
                                                />
                                                ) : null}
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
