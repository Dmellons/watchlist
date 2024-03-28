'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import MediaSearchCard from "./MediaSearchCard"
import { TMDBMultiSearchResult } from "@/types/tmdbApi"

const SearchMovie = ({
    // query
}: {
        // query:string
    }) => {


    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<TMDBMultiSearchResult[]>([])

    const movieList = async () => {
       
       const options = {
           method: 'GET',
           headers: {
               accept: 'application/json',
               Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`
            }
        };
        
        const res = fetch(`https://api.themoviedb.org/3/search/multi?query=${query}`, options)
            .then(res => res.json())
            .then(data => setResults(data.results))
            .catch(error => console.log(error))

        console.log(results)
    }


    return (
        <div className="p-3 flex flex-col items-center">
            <h1 className="text-3xl mb-4">Search Movies & TV</h1>

            <Input
                placeholder="Search Movie"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button
                className="my-5 w-24 align-middle"
                onClick={() => movieList()}
            >
                Search
            </Button>
            <div className="p-3 my-4 w-full">
                <div className="flex flex-col grid-flow-row gap-4 items-center w-full">
                {results.length === 0 && <div>No results</div>}
                {results.length > 0 &&
                        <>
                        <h2>Results!</h2><div className="flex flex-col gap-4 items-center">
                            {results.map((result) => (
                                <MediaSearchCard key={result.id} media={result} />
                            ))}
                        </div>
                        </>
                }
                </div>
            </div>

        </div>
    )
}

export default SearchMovie
