import { useState } from "react";
import { FavoriteProvider } from "./context/favorite-context";
import { SearchList } from "./pages/search-list";
import { FavoriteList } from "./pages/favorite-list";
import type { TPage } from "./types";
import { Home } from "./pages/home";
import { Toolbar } from "./components/toolbar";

function App() {
  const [currentPage, setCurrentPage] = useState<TPage>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "search":
        return <SearchList />;
      case "favorite":
        return <FavoriteList />;
      default:
        return (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="mb-4 text-xl text-gray-700">Page Not Found</p>
            <button
              className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              onClick={() => setCurrentPage("home")}
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <FavoriteProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Toolbar onPageChange={setCurrentPage} />
        <main className="container mx-auto flex-1 px-4 py-4">
          {renderPage()}
        </main>
      </div>
    </FavoriteProvider>
  );
}

export default App;
