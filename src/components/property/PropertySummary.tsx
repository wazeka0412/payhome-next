interface SummaryCardProps {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function SummaryCard({ title, children, fullWidth }: SummaryCardProps) {
  return (
    <div
      className={`bg-[#FFF8F0] rounded-2xl p-6 ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <h3 className="text-sm font-bold text-[#3D2200] mb-4 pb-2 border-b border-[#E8740C]/20">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface TableRowProps {
  label: string;
  value: string;
}

function TableRow({ label, value }: TableRowProps) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <th className="text-left text-xs text-gray-500 font-medium py-2 pr-4 w-28">
        {label}
      </th>
      <td className="text-sm text-gray-900 py-2">{value}</td>
    </tr>
  );
}

interface PriceInfo {
  total: string;
  building: string;
  land: string;
  misc: string;
  perTsubo: string;
}

interface SpecInfo {
  layout: string;
  floorArea: string;
  siteArea: string;
  coverageRatio: string;
  floorRatio: string;
  structure: string;
}

interface LandInfo {
  terrain: string;
  roadAccess: string;
  landRights: string;
  zoning: string;
  landCategory: string;
  buildingConditions: string;
}

interface EquipmentInfo {
  kitchen: string;
  bathroom: string;
  toilet: string;
}

interface PropertySummaryProps {
  price: PriceInfo;
  specs: SpecInfo;
  land: LandInfo;
  equipment: EquipmentInfo;
}

export default function PropertySummary({ price, specs, land, equipment }: PropertySummaryProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <SummaryCard title="価格・コスト情報">
        <div className="text-2xl font-extrabold text-[#E8740C] mb-3">
          {price.total}
          <span className="text-xs font-normal text-gray-500 ml-1">（税込）</span>
        </div>
        <div className="space-y-2">
          {[
            { label: '建物本体', value: price.building },
            { label: '土地代', value: price.land },
            { label: '諸費用', value: price.misc },
            { label: '坪単価', value: price.perTsubo },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </SummaryCard>

      <SummaryCard title="物件概要">
        <table className="w-full">
          <tbody>
            <TableRow label="間取り" value={specs.layout} />
            <TableRow label="延床面積" value={specs.floorArea} />
            <TableRow label="敷地面積" value={specs.siteArea} />
            <TableRow label="建ぺい率" value={specs.coverageRatio} />
            <TableRow label="容積率" value={specs.floorRatio} />
            <TableRow label="構造" value={specs.structure} />
          </tbody>
        </table>
      </SummaryCard>

      <SummaryCard title="土地・法規情報">
        <table className="w-full">
          <tbody>
            <TableRow label="地形" value={land.terrain} />
            <TableRow label="接道状況" value={land.roadAccess} />
            <TableRow label="土地の権利" value={land.landRights} />
            <TableRow label="用途地域" value={land.zoning} />
            <TableRow label="地目" value={land.landCategory} />
            <TableRow label="建築条件" value={land.buildingConditions} />
          </tbody>
        </table>
      </SummaryCard>

      <SummaryCard title="設備情報">
        <div className="space-y-3">
          {[
            { label: 'キッチン', value: equipment.kitchen },
            { label: 'お風呂', value: equipment.bathroom },
            { label: 'トイレ', value: equipment.toilet },
          ].map((item) => (
            <div key={item.label}>
              <span className="text-xs text-gray-500 block mb-0.5">{item.label}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </SummaryCard>
    </div>
  );
}
