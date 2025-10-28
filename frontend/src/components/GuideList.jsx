

// Función que renderiza una lista de guías
// Recibe un array de guías y devuelve una sección HTML con una lista de enlaces a cada guía.
function GuideList({guides}){
    return (
        <section>
            <h2>
                Guías
            </h2>
            <ul>
                {/* Iteramos sobre el array de guías y renderizamos un item de lista por cada una */}
                {guides.map(guide => (
                    <li key={guide.id} href={`/guides/${guide.id}`}> {guide.title} </li>
                ))}
            </ul>
        </section>
    );
}

// Exportamos la función como el componente predeterminado
export default GuideList
