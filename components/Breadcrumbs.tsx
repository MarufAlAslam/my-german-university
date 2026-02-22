'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <div className="relative">
        {/* Background gradient bar */}
        <div className="absolute inset-0 bg-linear-to-r from-black/5 via-red-600/8 to-yellow-400/10 rounded-full h-full"></div>
        
        <ol className="relative flex items-center gap-1 px-4 py-3">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <div className="flex items-center mx-1">
                  {/* Unique diagonal separator with German colors */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute w-0.5 h-6 bg-linear-to-b from-red-600/40 via-yellow-400/40 to-black/40 rotate-12"></div>
                    {/* <div className="text-gray-400 text-xs font-bold">▶</div> */}
                  </div>
                </div>
              )}
              
              {item.active ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg shadow-red-600/30 font-semibold text-sm">
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-yellow-400 text-gray-700 hover:text-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm border border-gray-200 hover:border-yellow-500 group"
                >
                  {item.icon && (
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
