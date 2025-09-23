import type { ProviderItem } from "../types";


export default function ProviderGroup({ title, items }: { title: string; items: ProviderItem[] }) {
return (
<div>
<h3 className="text-sm font-semibold text-slate-300 mb-2">{title}</h3>
{items.length === 0 ? (
<div className="text-sm text-slate-500">None</div>
) : (
<div className="flex flex-wrap gap-3">
{items.map((p) => (
<a
key={`${p.providerId}-${p.name}`}
href={p.link || "#"}
target="_blank"
rel="noreferrer"
className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2"
>
{p.logoUrl ? (
<img src={p.logoUrl} alt={p.name} className="w-6 h-6 rounded" />
) : (
<div className="w-6 h-6 rounded bg-slate-700" />
)}
<span className="text-sm">{p.name}</span>
</a>
))}
</div>
)}
</div>
);
}