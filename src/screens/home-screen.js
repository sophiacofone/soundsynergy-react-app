import React, {useState} from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {
    findAlbumImageId,
    findAlbumNameId, findArtistGenreId,
    findArtistImageId,
    findArtistNameId,
    findLikesByUserId, findTrackGenreId, findTrackImageId, findTrackNameId
} from "../spotify/likes-service";
import {findAllUsersThunk} from "../services/users/users-thunks";



function HomeScreen() {
    const { currentUser, users } = useSelector((state) => state.users);
    const [likes, setLikes] = useState([]);
    const [likedGenres, setLikedGenres] = useState([]);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchLikes = async () => {
        const likes = await findLikesByUserId(currentUser._id);
        const likesData = await Promise.all(
            likes.map(async (like) => {
                let name;
                let image;
                let genre;
                if (like.type === "album") {
                    name = await findAlbumNameId(like.musicThingId)
                    image = await findAlbumImageId(like.musicThingId);
                } else if (like.type === "artist") {
                    name = await findArtistNameId(like.musicThingId)
                    image = await findArtistImageId(like.musicThingId);
                    genre = await findArtistGenreId(like.musicThingId);
                } else if (like.type === "track") {
                    name = await findTrackNameId(like.musicThingId)
                    image = await findTrackImageId(like.musicThingId);
                    genre = await findTrackGenreId(like.musicThingId);
                }
                return {
                    ...like,
                    name,
                    image,
                    genre,
                };
            })
        );
        setLikes(likesData);

        const genresSet = new Set();

        likesData.forEach((like) => {
            if (like.genre) {
                like.genre.forEach((genre) => {
                    genresSet.add(genre);
                });
            }
        });

        const uniqueGenres = Array.from(genresSet);
        setLikedGenres(uniqueGenres);
    };

    useEffect(() => {
        dispatch(findAllUsersThunk());
    }, []);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchLikes();
        }
    }, [currentUser]);

    const randomIndex = Math.floor(Math.random() * likes.length);

    const randomElement = likes[randomIndex];

    const randomIndex1 = Math.floor(Math.random() * users.length);

    const randomElement1 = users[randomIndex1];

    return (
        <div>
            <div className="card m-3">
                <h3 className="card-header text-center">Welcome to SoundSynergy!</h3>
                <div className="card-body">
                    <h5 className="card-title text-center">SoundSynergy lets you explore your music, connect with
                        friends that share your taste, and discover new places to meet other music lovers like you <i className="bi bi-music-note-beamed"></i>
                    </h5>

                </div>
                <div className="card-body p-1">
                    {currentUser === null && (
                    <div>
                        <h6 className="card-subtitle text-muted text-center"><i className="bi bi-stars"></i>See what's
                            possible with SoundSynergy, and log in!
                            <i className="bi bi-stars"></i>
                            <div className="mt-2">
                                <Link to="/login"  className='btn btn-primary'> Log in »</Link>
                            </div>
                            <div className="row mt-2">
                                <div className="col-4">
                                </div>
                                <div className="col-4 text-center">
                                    <div>
                                        <div className="card text-white mb-1">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        {randomElement1 && (
                                                            <p className="card-text"> <strong> {randomElement1.username} </strong> joined SoundSynergy!</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                </div>
                            </div>
                        </h6>
                    </div>
                    )}
                    {currentUser && currentUser.role === "USER" && randomElement && (
                        <div className="row">
                        <div className="col-3">
                        </div>
                        <div className="col-6">
                            <Link to={`/search/artist/${randomElement.musicThingId}`} style={{ textDecoration: 'none' }}>
                                <div className="card text-white mb-1">
                                    <div className="card-body p-2">
                                        <div className="row">
                                            <div className="col-10 d-flex justify-content-center align-items-center">
                                                <p className="card-text">You liked <strong>{randomElement.name}</strong>!</p>
                                            </div>
                                            <div className="col-2 d-none d-lg-block">
                                                <img
                                                    src={randomElement.image}
                                                    className="img-thumbnail"
                                                    style={{ width: "4rem", height: "4rem" }}
                                                    alt={randomElement.name}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                       </div>
                        <div className="col-3">
                        </div>
                        </div>
                    )}
                    {currentUser && currentUser.role === "BUSINESS" && (
                        <div>

                        </div>
                    )}
                </div>
                <div className="card-body">
                    <div className="container marketing">
                        <div className="row">
                            <div className="col-lg-6 text-center">
                                {currentUser === null ? (
                                    <div>

                                        <h2 className="fw-normal">Share</h2>
                                        <p>Search for any song, and see which of your friends are most likely to enjoy it.</p>
                                        <Link to="/search"  className='btn btn-secondary'>
                                            <span className=""> Search »</span>
                                        </Link>
                                    </div>
                                ) : currentUser.role === "USER" ? (
                                    <div>
                                        <h2 className="fw-normal">Share</h2>
                                        <p>Search for any song, and see which of your friends are most likely to enjoy it.</p>
                                        <Link to="/search"  className='btn btn-secondary'>
                                            <span className=""> Search »</span>
                                        </Link>
                                    </div>
                                )   : (
                                    <div>
                                        <h2 className="fw-normal">Save</h2>
                                        <p>Search for any song, and save it so your followers know what you play.</p>
                                        <Link to="/search"  className='btn btn-secondary'>
                                            <span className=""> Search »</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-6 text-center">
                                {currentUser === null ? (
                                    <div>
                                        <h2 className="fw-normal">Connect</h2>
                                        <p>Learn about local restaurants, cafes, and shops that play music you will love. </p>
                                        <div className="mt-2 mb-2">
                                            <Link to="/login"  className='btn btn-secondary'> Log in »</Link>
                                        </div>
                                    </div>
                                    ) : currentUser.role === "USER" ? (
                                    <div>
                                        <h2 className="fw-normal">Connect</h2>
                                        <p>Learn about local restaurants, cafes, and shops that play music you will love. </p>
                                        <Link to="/connect"  className='btn btn-secondary'>
                                            <span className=""> Connect »</span>
                                        </Link>
                                    </div>
                                    )   : (
                                    <div>
                                    <h2 className="fw-normal">Analyze</h2>
                                    <p>Learn about your follower's music preferences. </p>
                                        <Link to="/analysis"  className='btn btn-secondary'>
                                            <span className=""> Analysis »</span>
                                        </Link>
                                    </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-muted">
                    Sound Synergy - Home
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;
