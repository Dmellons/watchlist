'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import MediaSearchCard from "./MediaSearchCard"
import { TMDBMultiSearchResult } from "@/types/tmdbApi"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { Skeleton } from "./ui/skeleton"
import SkeletonMediaSearchCard from "./skeletons/SkeletonMediaSearchCard"
import NewSearchCard from "@/components/NewSearchCard"
import { useUser } from "@/hooks/User"
import { tmdbFetchOptions } from "@/lib/tmdb"
import GenreFilterDropdown from "./GenreFilterDropdown"
import { Popover } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { Dialog } from "./ui/dialog"


const NewSearchBar = ({
    resultsLength = 10
    // query
}: {
    resultsLength?: number
    // query:string

}) => {
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<TMDBMultiSearchResult[]>([])
    const [genreFilter, setGenreFilter] = useState<number[]>([])

    const { user } = useUser()


    // useEffect(() => {
    //     setLoading(true)

    //     movieList()


    // }, [query])
    const movieList = async () => {
        setLoading(false)
        setResults([])

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`
            }
        };

        const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}`, tmdbFetchOptions)
            .then(res => res.json())
            .then(data => setResults(data.results))
            // .then(() => setLoading(false))
            .catch(error => console.log(error))
        setLoading(false)

    }



    return (
        

        <div className="w-full hidden sm:absolute sm:flex top-0 z-50 font-normal">

            <div className="flex flex-col gap-2 items-center w-full">


                <div className="flex items-center w-fit">

                    <Input
                        placeholder="Movie, TV Show, Person..."
                        value={query}
                        className="bg-muted/90  text-muted-foreground w-80 h-8 rounded-md p-2"
                        onChange={(e) => {

                            setQuery(e.target.value)

                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                movieList()
                            }
                        }}
                    />


                    <Button
                        className="w-18 align-middle h-8 ml-2"
                        onClick={() => movieList()}
                    >
                        Search
                    </Button>
                    <Button
                        variant="secondary"
                        className="my-5 w-24 align-middle"
                        onClick={() => setResults([])}
                    >
                        Clear
                    </Button>
                </div>

                {/* <GenreFilterDropdown setFilter={setGenreFilter} /> */}
                    <div className=" z-50 max-w-5xl bg-card/80 rounded-lg py-4 px-2 m-auto shadow-xl shadow-black">

                        {
                            results.length > 0 && !loading &&
                            // <div>


                                // <div className="p-3 my-4 w-full">

                                    <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center gap-4 items-center place-items-center lg:w-full m-auto">
                                        {loading ? (
                                            
                                            <SkeletonMediaSearchCard />
                                            
                                        ) : (
                                            

                                            results.slice(0, resultsLength).map((result) => (
                                                <NewSearchCard key={result.id} media={result} userProviders={user?.providers} />
                                            ))
                                        )}

                                    </div>
                                // </div>
                            // </div>
                        }
                    </div>
                  
                




            </div>
        </div >
    )
}

export default NewSearchBar
