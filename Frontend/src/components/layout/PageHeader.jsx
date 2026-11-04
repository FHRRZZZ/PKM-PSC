import { Link } from 'react-router-dom';

// breadcrumb: [{ label, to? }]
export default function PageHeader({ breadcrumb = [], title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div>
        {breadcrumb.length > 0 && (
          <nav className="breadcrumb">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {i > 0 && ' › '}
                {b.to ? <Link to={b.to}>{b.label}</Link> : b.label}
              </span>
            ))}
          </nav>
        )}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
