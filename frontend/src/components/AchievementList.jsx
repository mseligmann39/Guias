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
