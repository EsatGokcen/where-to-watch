import { Link } from "react-router-dom";
import RegionSelect from "./RegionSelect";


export default function Header() {
return (
<header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
<Link to="/" className="font-semibold text-lg">Where to Watch</Link>
<div className="ml-auto"><RegionSelect /></div>
</div>
</header>
);
}