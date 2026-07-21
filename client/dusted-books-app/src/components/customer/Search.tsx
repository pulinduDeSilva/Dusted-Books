import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const nav = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            nav(`/user/browse?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    }

    return (
        <>
            <div className="flex justify-center w-full my-10 md:my-20">
                <aside className="mx-5 flex items-center justify-center w-full">
                    <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for books..."
                            className="bg-gray-100 text-gray-800 placeholder:text-gray-500 border border-gray-300 rounded-2xl py-2 px-7 w-full focus:outline-none focus:ring-0"
                        />
                        {/* Optional: Add a visually hidden submit button for accessibility */}
                        <button type="submit" className="sr-only">Search</button>
                    </form>
                </aside>
            </div>

        </>
    );
}

export default Search;