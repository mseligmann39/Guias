

function GuideList({guides}){
    return (
        <section>
            <h2>
                Guías
            </h2>
            <ul>
                {guides.map(guide => (
                    <li key={guide.id} href={`/guides/${guide.id}`}> {guide.title} </li>
                ))}
            </ul>
        </section>
    );
}

export default GuideList