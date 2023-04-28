import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {findAlbumNameId, findArtistNameId, findLikesByUserId, findTrackNameId, findAlbumImageId, findArtistImageId, findTrackImageId, findArtistGenreId, findTrackGenreId} from "../spotify/likes-service";



export default function ConnectShare() {
    const {currentUser, users} = useSelector((state) => state.users);

    const [likes, setLikes] = useState([]);
    const [likedGenres, setLikedGenres] = useState([]);



    const navigate = useNavigate();
    const dispatch = useDispatch();

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
            fetchLikes();
    }, []);


    return (
        <>
        <div className="row mb-2">
            <div className="col-md-12">
                <h5>Recent likes</h5>
                <p>Here are your most recent likes. Try clicking share to see which of your friends we think would enjoy it the most! </p>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <div className="table-responsive">
                    {likes.length > 0 && (
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                {likes
                                    .map((like) => (
                                        <td key={like.musicThingId}>
                                            <Link to={`/search/${like.type}/${like.musicThingId}`}>
                                                <div className="card">
                                                    <h6 className="card-header">{like.name}</h6>
                                                    <img
                                                        src={like.image}
                                                        className="card-img-top"
                                                        style={{ width: "12rem", height: "12rem" }}
                                                        alt={like.name}
                                                    />
                                                </div>
                                            </Link>
                                        </td>
                                    ))}
                            </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
