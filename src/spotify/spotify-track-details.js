import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTrack } from "./spotify-service";

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
      <h1>{track.name}</h1>
      <pre>{JSON.stringify(track, null, 2)}</pre>
    </div>
  );
}

export default SpotifyTrackDetailsScreen;
