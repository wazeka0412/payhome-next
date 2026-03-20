import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumbs, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="text-sm mb-4 opacity-85">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1">&gt;</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm opacity-90">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
