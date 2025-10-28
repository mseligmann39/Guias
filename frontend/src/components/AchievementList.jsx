/*
 * Este componente se encarga de renderizar una lista de logros.
 * Recibe por par metro un array de logros y devuelve una secci n HTML con una lista de enlaces a cada logro.
 */
function AchievementList({achievements}){
    return (
        <section>
            <h2>
                Logros
            </h2>
            <ul>
                {achievements.map(achievement => (
                    <li key={achievement.id} href={`/achievements/${achievement.id}`}> {achievement.title} </li>
                ))}
            </ul>
        </section>
    );
}

export default AchievementList

