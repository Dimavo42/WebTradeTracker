import type { PricePoint } from "../../types/stock";
import styles from "./PriceChart.module.css";

const WIDTH = 300;
const HEIGHT = 140;
const PAD_Y = 6;

type PriceChartProps = {
  symbol: string;
  points: PricePoint[];
};

export default function PriceChart({ symbol, points }: PriceChartProps) {
  if (points.length < 2) {
    return <p className={styles.empty}>Not enough price history.</p>;
  }

  const closes = points.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const x = (i: number) => (i / (points.length - 1)) * WIDTH;
  const y = (value: number) =>
    PAD_Y + (1 - (value - min) / range) * (HEIGHT - 2 * PAD_Y);

  const line = points
    .map((p, i) => `${x(i).toFixed(1)},${y(p.close).toFixed(1)}`)
    .join(" ");
  const area = `0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`;

  const first = points[0];
  const last = points[points.length - 1];
  const isUp = last.close >= first.close;
  const changePercent = ((last.close - first.close) / first.close) * 100;

  return (
    <div className={styles.chart}>
      <div className={styles.summary}>
        <span className={styles.lastPrice}>{last.close.toFixed(2)}</span>
        <span className={isUp ? styles.up : styles.down}>
          {isUp ? "+" : ""}
          {changePercent.toFixed(1)}% in 5 years
        </span>
      </div>

      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${symbol} weekly closing price over 5 years, from ${first.close.toFixed(2)} to ${last.close.toFixed(2)}`}
      >
        <polygon
          points={area}
          className={isUp ? styles.areaUp : styles.areaDown}
        />
        <polyline
          points={line}
          fill="none"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          className={isUp ? styles.lineUp : styles.lineDown}
        />
      </svg>

      <div className={styles.axis}>
        <span>{new Date(first.date).getFullYear()}</span>
        <span>
          Low {min.toFixed(2)} · High {max.toFixed(2)}
        </span>
        <span>{new Date(last.date).getFullYear()}</span>
      </div>
    </div>
  );
}
