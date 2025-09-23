import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="max-w-6xl mx-auto px-4 pb-10 text-xs text-slate-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        Streaming availability data courtesy of JustWatch.
      </footer>
    </div>
  );
}
