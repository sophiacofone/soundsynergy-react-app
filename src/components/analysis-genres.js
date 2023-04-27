import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import { findGenresByUserId } from "../spotify/likes-service";


export default function AnalysisGenres() {
    const {currentUser, users} = useSelector((state) => state.users);

    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [showModalGenre, setModalGenre] = useState(false);
    const [checkboxes, setCheckboxes] = useState({
        acoustic: false,
        afrobeat: false,
        altrock: false,
        alternative: false,
        children: false,
        chill: false,
        classical: false,
        club: false,
        country: false,
        dance: false,
        edm: false,
        electronic: false,
        folk: false,
        funk: false,
        happy: false,
        hipHop: false,
        holidays: false,
        house: false,
        indie: false,
        indiePop: false,
        jazz: false,
        kPop: false,
        latin: false,
        metal: false,
        movies: false,
        piano: false,
        pop: false,
        punk: false,
        rnb: false,
        rap: false,
        reggae: false,
        reggaeton: false,
        rock: false,
        romance: false,
        sad: false,
        singerSongwriter: false,
        soul: false,
        study: false,
        techno: false,
    });
    const [likedGenres, setLikedGenres] = useState([]);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleModalGenreOpen = () => setModalGenre(true);
    const handleModalGenreClose = () => setModalGenre(false);

    const handleCheckboxChange = (event) => {
        setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
    };

    const handleSubmitGenre = () => {
        const selectedGenres = Object.keys(checkboxes)
            .filter((genre) => checkboxes[genre])
            .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1));

        setFavoriteGenres(selectedGenres);
        handleModalGenreClose();
    };

    useEffect(() => {
        const fetchLikedGenres = async () => {
            const genres = await findGenresByUserId(currentUser._id);
            setLikedGenres(genres);
        };

        fetchLikedGenres();
    }, []);

    return (
        <div className="row">
            <div className="col-12">
                    <div className="">
                        <div className="card border-primary">
                            <div className="card-header">Liked Genres</div>
                            {likedGenres.length > 0 ? (
                                <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                    {likedGenres.map((genre) => (
                                        <div>
                                            <li className="list-group-item">
                                                {genre}
                                            </li>
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <div className="card-body">
                                    <p className="card-text">You have not liked any genres yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
            {/*<div className="col-6">
                    <div className="">
                        <div className="">
                            <div className="card border-primary">
                                <div className="card-header">
                                    Favorite Genres
                                    <button className="btn btn-secondary btn-sm ml-2 float-end" onClick={handleModalGenreOpen}>
                                        Change
                                    </button>
                                </div>
                                {favoriteGenres.length !== 0 ? (
                                    <div>
                                        <ul
                                            className="list-group list-group-flush overflow-auto shadow"
                                            style={{ maxHeight: '235px' }}
                                        >
                                            {favoriteGenres.map((genre, index) => (
                                                <li key={index} className="list-group-item">
                                                    <p>{genre}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="card-body">No favorite genres found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {showModalGenre && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Select Genres</h5>
                                        <button type="button" className="btn-close" onClick={handleModalGenreClose}>
                                            <span aria-hidden="true"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="acoustic"
                                                        id="acoustic"
                                                        checked={checkboxes.acoustic}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="acoustic">
                                                        Acoustic
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="afrobeat"
                                                        id="afrobeat"
                                                        checked={checkboxes.afrobeat}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="afrobeat">
                                                        Afrobeat
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="altrock"
                                                        id="altrock"
                                                        checked={checkboxes.altrock}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="altrock">
                                                        Alt-Rock
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="alternative"
                                                        id="alternative"
                                                        checked={checkboxes.alternative}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="alternative">
                                                        Alternative
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="children"
                                                        id="children"
                                                        checked={checkboxes.children}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="children">
                                                        Children
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="chill"
                                                        id="chill"
                                                        checked={checkboxes.chill}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="chill">
                                                        Chill
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="classical"
                                                        id="classical"
                                                        checked={checkboxes.classical}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="classical">
                                                        Classical
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="club"
                                                        id="club"
                                                        checked={checkboxes.club}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="club">
                                                        Club
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="country"
                                                        id="country"
                                                        checked={checkboxes.country}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="country">
                                                        Country
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="dance"
                                                        id="dance"
                                                        checked={checkboxes.dance}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="dance">
                                                        Dance
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="edm"
                                                        id="edm"
                                                        checked={checkboxes.edm}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="edm">
                                                        EDM
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="electronic"
                                                        id="electronic"
                                                        checked={checkboxes.electronic}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="electronic">
                                                        Electronic
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="folk"
                                                        id="folk"
                                                        checked={checkboxes.folk}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="folk">
                                                        Folk
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="funk"
                                                        id="funk"
                                                        checked={checkboxes.funk}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="funk">
                                                        Funk
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="happy"
                                                        id="happy"
                                                        checked={checkboxes.happy}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="happy">
                                                        Happy
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="hipHop"
                                                        id="hipHop"
                                                        checked={checkboxes.hipHop}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="hipHop">
                                                        Hip-Hop
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="holidays"
                                                        id="holidays"
                                                        checked={checkboxes.holidays}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="holidays">
                                                        Holidays
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="house"
                                                        id="house"
                                                        checked={checkboxes.house}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="house">
                                                        House
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="indie"
                                                        id="indie"
                                                        checked={checkboxes.indie}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="indie">
                                                        Indie
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="indiePop"
                                                        id="indiePop"
                                                        checked={checkboxes.indiePop}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="indiePop">
                                                        Indie Pop
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="jazz"
                                                        id="jazz"
                                                        checked={checkboxes.jazz}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="jazz">
                                                        Jazz
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="kPop"
                                                        id="kPop"
                                                        checked={checkboxes.kPop}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="kPop">
                                                        K-Pop
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="latin"
                                                        id="latin"
                                                        checked={checkboxes.latin}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="latin">
                                                        Latin
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="metal"
                                                        id="metal"
                                                        checked={checkboxes.metal}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="metal">
                                                        Metal
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="movies"
                                                        id="movies"
                                                        checked={checkboxes.movies}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="movies">
                                                        Movies
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="piano"
                                                        id="piano"
                                                        checked={checkboxes.piano}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="piano">
                                                        Piano
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="pop"
                                                        id="pop"
                                                        checked={checkboxes.pop}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="pop">
                                                        Pop
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="punk"
                                                        id="punk"
                                                        checked={checkboxes.punk}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="punk">
                                                        Punk
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="rnb"
                                                        id="rnb"
                                                        checked={checkboxes.rnb}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="rnb">
                                                        R&B
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="rap"
                                                        id="rap"
                                                        checked={checkboxes.rap}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="rap">
                                                        Rap
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="reggae"
                                                        id="reggae"
                                                        checked={checkboxes.reggae}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="reggae">
                                                        Reggae
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="reggaeton"
                                                        id="reggaeton"
                                                        checked={checkboxes.reggaeton}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="reggaeton">
                                                        reggaeton
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="rock"
                                                        id="rock"
                                                        checked={checkboxes.rock}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="rock">
                                                        Rock
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="romance"
                                                        id="romance"
                                                        checked={checkboxes.romance}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="romance">
                                                        Romance
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="sad"
                                                        id="sad"
                                                        checked={checkboxes.sad}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="sad">
                                                        Sad
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="singerSongwriter"
                                                        id="singerSongwriter"
                                                        checked={checkboxes.singerSongwriter}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="singerSongwriter">
                                                        Singer Songwriter
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="soul"
                                                        id="soul"
                                                        checked={checkboxes.soul}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="soul">
                                                        Soul
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="study"
                                                        id="study"
                                                        checked={checkboxes.study}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="study">
                                                        Study
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="techno"
                                                        id="techno"
                                                        checked={checkboxes.techno}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="techno">
                                                        Techno
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={handleSubmitGenre}>
                                            Save changes
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={handleModalGenreClose}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>*/}
        </div>
    );
}
