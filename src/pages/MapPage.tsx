import type { Lesson } from '../types/lesson';

type MapPageProps = {
  lessons: Lesson[];
  completedLessons: Record<string, string>;
};

export const MapPage = ({ lessons, completedLessons }: MapPageProps) => {
  const radius = 180;
  const center = 220;

  const points = lessons.map((lesson, index) => {
    const angle = (index / lessons.length) * Math.PI * 2 - Math.PI / 2;
    return {
      lesson,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  const pointMap = new Map(points.map((point) => [point.lesson.id, point]));

  return (
    <section>
      <header>
        <p className="label">Map</p>
        <h2>Concept relations</h2>
      </header>
      <svg aria-label="Concept map" viewBox="0 0 440 440" className="map-svg" role="img">
        {points.flatMap((point) =>
          point.lesson.related.flatMap((relatedId) => {
            const related = pointMap.get(relatedId);
            if (!related) {
              return [];
            }
            return (
              <line
                key={`${point.lesson.id}-${relatedId}`}
                x1={point.x}
                y1={point.y}
                x2={related.x}
                y2={related.y}
                className="map-edge"
              />
            );
          }),
        )}
        {points.map((point) => (
          <g key={point.lesson.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={22}
              className={completedLessons[point.lesson.id] ? 'map-node done' : 'map-node'}
            />
            <text x={point.x} y={point.y + 4} textAnchor="middle" className="map-label">
              {point.lesson.id.slice(0, 3)}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
};
