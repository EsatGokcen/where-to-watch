import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { apiMovie, apiProviders } from "../api";
import ProviderGroup from "../components/ProviderGroup";


export default function Movie() {
const params = useParams();
const id = Number(params.id);
const region = useMemo(() => localStorage.getItem("region") || "GB", []);


const detailsQ = useQuery({ queryKey: ["movie", id], queryFn: () => apiMovie(id) });
const providersQ = useQuery({ queryKey: ["providers", id, region], queryFn: () => apiProviders(id, region) });


if (detailsQ.isLoading) return <div>Loading…</div>;
if (detailsQ.error || !detailsQ.data) return <div>Failed to load.</div>;


const d = detailsQ.data;
const av = providersQ.data;


return (
<div>
<div className="grid md:grid-cols-[240px,1fr] gap-6">
<div>
{d.posterUrl ? (
<img src={d.posterUrl} alt={d.title} className="rounded-2xl border border-slate-800" />
) : (
<div className="w-full aspect-[2/3] rounded-2xl border border-slate-800 grid place-items-center text-slate-500">No Image</div>
)}
</div>
<div>
<h1 className="text-2xl font-semibold">{d.title} {d.year ? <span className="text-slate-400">({d.year})</span> : null}</h1>
{d.runtime ? <div className="text-slate-400 text-sm mt-1">{d.runtime} min</div> : null}
{d.genres?.length ? <div className="text-slate-400 text-sm mt-1">{d.genres.join(", ")}</div> : null}
<p className="mt-4 text-slate-200 leading-relaxed">{d.overview}</p>
</div>
</div>


<div className="mt-8 grid gap-6 md:grid-cols-2">
<ProviderGroup title="Free / Ads" items={av?.free_ads || []} />
<ProviderGroup title="Subscription" items={av?.subscription || []} />
<ProviderGroup title="Rent" items={av?.rent || []} />
<ProviderGroup title="Buy" items={av?.buy || []} />
</div>
</div>
);
}