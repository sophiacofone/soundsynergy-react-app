import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArtist } from "./spotify-service";

function SpotifyArtistDetailsScreen() {
  const { id } = useParams();
  const [artist, setArtist] = useState({});
  const fetchArtist = async () => {
    const response = await getArtist(id);
    setArtist(response);
  };
  useEffect(() => {
    fetchArtist();
  }, []);
  return (
    <div>
      <h1>{artist.name}</h1>
      <pre>{JSON.stringify(artist, null, 2)}</pre>
    </div>
  );
}

export default SpotifyArtistDetailsScreen;
