import { useTranslations } from 'next-intl';

/** 2013 · ~250 · 6 — las tres cifras del cliente, en una franja. */
export function Stats() {
  const t = useTranslations('home.nosotros.stats');

  const items = [
    { value: t('foundedValue'), label: t('foundedLabel') },
    { value: t('peopleValue'), label: t('peopleLabel') },
    { value: t('areasValue'), label: t('areasLabel') },
  ];

  return (
    <dl className="stats-strip">
      {items.map((s) => (
        <div key={s.label}>
          <dd className="stat-value" style={{ margin: 0 }}>
            {s.value}
          </dd>
          <dt className="stat-label">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
