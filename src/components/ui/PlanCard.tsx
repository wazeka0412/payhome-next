interface PlanFeature {
  label: string;
  value: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: string;
  priceUnit: string;
  features: PlanFeature[];
  featured?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  onClick?: () => void;
}

export default function PlanCard({
  name,
  price,
  priceUnit,
  features,
  featured = false,
  ctaLabel = '詳しく見る',
  ctaHref,
  onClick,
}: PlanCardProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-6 flex flex-col transition hover:-translate-y-1 hover:shadow-xl text-left ${
        onClick ? 'cursor-pointer' : ''
      } ${
        featured
          ? 'border-2 border-[#E8740C] shadow-lg'
          : 'border-2 border-gray-100 shadow-md'
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8740C] text-white text-xs font-bold px-4 py-1 rounded-full">
          おすすめ
        </span>
      )}

      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-3xl font-extrabold text-[#E8740C] font-mono">{price}</span>
        <span className="text-sm text-gray-500 ml-1">{priceUnit}</span>
      </div>

      <div className="flex-1 space-y-0">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-b-0 text-sm">
            <span className="text-gray-700">{feature.label}</span>
            <span className={`ml-2 shrink-0 font-semibold ${feature.included ? 'text-green-600' : 'text-gray-300'}`}>
              {feature.included ? feature.value || '\u2705' : '\u274C'}
            </span>
          </div>
        ))}
      </div>

      {ctaHref ? (
        <a
          href={ctaHref}
          className={`block text-center mt-6 py-3 rounded-full font-semibold text-sm transition ${
            featured
              ? 'bg-[#E8740C] text-white hover:bg-[#D4660A]'
              : 'border-2 border-[#E8740C] text-[#E8740C] hover:bg-orange-50'
          }`}
        >
          {ctaLabel}
        </a>
      ) : (
        <span
          className={`block text-center mt-6 py-3 rounded-full font-semibold text-sm transition ${
            featured
              ? 'bg-[#E8740C] text-white'
              : 'border-2 border-[#E8740C] text-[#E8740C]'
          }`}
        >
          {ctaLabel}
        </span>
      )}
    </Wrapper>
  );
}
