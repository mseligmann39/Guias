import { Link } from "react-router-dom";

/*
 * Este componente se encarga de renderizar una lista de logros.
 * Recibe por parámetro un array de logros y devuelve una sección HTML con una lista de enlaces a cada logro.
 */

interface Achievement {
  id: number | string;
  title: string;
}

interface AchievementListProps {
  achievements: Achievement[];
}

function AchievementList({ achievements }: AchievementListProps) {
  return (
    <section>
      <h2>Logros</h2>
      <ul>
        {achievements.map((achievement) => (
          <li key={achievement.id}>
            <Link to={`/achievements/${achievement.id}`}>{achievement.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AchievementList;
