import { Link } from 'react-router-dom';

export default function PageHeader({
  breadcrumb = [],
  title,
  subtitle,
  actions,
}) {
  return (
    <header className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      {/* Informasi halaman */}
      <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500"
          >
            {breadcrumb.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span className="text-slate-300" aria-hidden="true">
                    /
                  </span>
                )}

                {item.to ? (
                  <Link
                    className="transition-colors duration-150 hover:text-red-700"
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="break-words text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-1 max-w-2xl break-words text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}