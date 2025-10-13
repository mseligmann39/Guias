import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Achievement from "./Achievement";
import GuideList from "./GuideList";

const[game, setGame] = useState(null);
const [guides, setGuides] = useState([]);
const [achievements, setAchievements] = useState([]);
const [isLoading, setIsLoading] = useState(true);
function GameDetailPage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    

    useEffect(() => {
        // definimos las urls de games guides y achievements
        const gamesURL = `${import.meta.env.VITE_API_BASE_URL}/games/${id}`;
        const guidesURL = `${import.meta.env.VITE_API_BASE_URL}/guides/game_id=${id}`;
        const achievementsURL = `${import.meta.env.VITE_API_BASE_URL}achievements/game_id=${id}`;

        //preparamos las peticiones
        const requestGames = axios.get(gamesURL);
        const requestGuides = axios.get(guidesURL);
        const requestAchievements = axios.get(achievementsURL);
        
        // Usamos promise.all para ejecutarlas en paralelo
        Promise.all([requestGames, requestGuides, requestAchievements])
            .then(axios.spread((gameResponse, guidesResponse, achievementsResponse) => {
            const gameResponse = responses[0];
            const guidesResponse = responses[1];
            const achievementsResponse = responses[2];

            setGame(gameResponse.data);
            setGuides(guidesResponse.data);
            setAchievements(achievementsResponse.data);
            setIsLoading(false);
        }))
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        })


        axios.get(`${import.meta.env.VITE_API_BASE_URL}games/${id}`)
            .then(response => setGame(response.data))
            .catch(error => console.log(error));
    }, [id]);

    if (isLoading){
        return <p className="loading">Loading...</p>;
    }
    return (
        <div>
            <h1>{game?.title}</h1>
            <img src={game.cover_image_url} alt= {`portada de ${game.title}`} />
            <p>
                {game?.description}
            </p>
            <p>Fecha de lanzamiento:
                {game?.release_date}    
            </p>

            <hr />
            <hr />
            <h2>Achievements</h2>
            {achievements.map(achievement => (
                <Achievement key={achievement.id} achievement={achievement} />
            ))}
            <hr />
            <h2>Guides</h2>
            <GuideList guides={guides} />
        </div>
        
    );
}

export default GameDetailPage