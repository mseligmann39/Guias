import React, {useState, useEffect} from "react";
import axios from "axios";
import GameCard from "../components/GameCard";

function HomePage() {
    // estado para almacenar los juegos
    const [games, setGames] = useState([]);
    // useEffect para hacer la peticion a la api
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        // url de la api
        const apiURL = `${import.meta.env.VITE_API_BASE_URL}games`;
        
        // hacer la peticion get

        axios.get(apiURL)
            .then(response => {
                setGames(response.data); // o response.data.data
                setIsLoading(false); // <-- IMPORTANTE: Actualiza el estado aquí
            })
            .catch(error => {
                console.error("Hubo un error al obtener los juegos:", error);
                setIsLoading(false); // <-- También aquí para que no se quede cargando infinitamente
            });
    }, []);
    
    // renderizar la lista de juegos

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>
                Lista de juegos
            </h1>
            <div className="game-grid">
                {games.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
    
}

export default HomePage;

