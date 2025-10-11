import React, {useState, useEffect} from "react";
import axios from "axios";

function GameList() {
    // estado para almacenar los juegos
    const [games, setGames] = useState([]);
    // useEffect para hacer la peticion a la api
    useEffect(() => {

        // url de la api
        const apiURL = `${import.meta.env.VITE_API_BASE_URL}games`;
        
        // hacer la peticion get

        axios.get(apiURL)
            .then(response => setGames(response.data))
            .catch(error => console.log(error));
    }, []);
    
    // renderizar la lista de juegos
    return (
        console.log(games),
        <ul>
            {games.map(game => (
                <li key={game.id}>{game.title}</li>
            ))}
        </ul>
    );
    
}

export default GameList;

