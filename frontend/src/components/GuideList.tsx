
import { Link } from "react-router-dom";

// Definimos la estructura de un objeto 'guide'
interface Guide {
    id: number | string; // El ID puede ser número o texto
    title: string;
}

// Definimos las props para el componente GuideList
interface GuideListProps {
    guides: Guide[];
}

// Función que renderiza una lista de guías
// Recibe un array de guías y devuelve una sección HTML con una lista de enlaces a cada guía.
function GuideList({ guides }: GuideListProps){
    return (
        <section>
            <h2>
                Guías
            </h2>
            <ul>
                {/* Iteramos sobre el array de guías y renderizamos un ítem de lista por cada una */}
                {guides.map(guide => (
                    <li key={guide.id}>
                        <Link to={`/guides/${guide.id}`}>{guide.title}</Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

// Exportamos la función como el componente predeterminado
export default GuideList
