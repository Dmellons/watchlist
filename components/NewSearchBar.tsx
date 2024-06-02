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

import { ScrollArea } from "./ui/scroll-area"
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { IconButton } from "./ui/button";

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

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
    const [moreResults, setMoreResults] = useState<boolean>(false)
    const [genreFilter, setGenreFilter] = useState<number[]>([])

    const { user } = useUser()


    useEffect(() => {
        setLoading(true)

        movieList()


    }, [query])
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
            .then(data => {
                setResults(data.results)
                setMoreResults(data.results.length > resultsLength)
            })
            // .then(() => setLoading(false))
            .catch(error => console.log(error))
        setLoading(false)

    }




    return (


        // <div className="w-full  absolute sm:flex top-0 z-10 font-normal">

        <div className="flex flex-col gap-2 items-center w-full">


            <div className="flex flex-col gap-1 sm:gap-2 sm:flex-row items-center w-2/5 my-5  ">

                <Input
                    placeholder="Movie, TV Show, Person..."
                    value={query}
                    className="bg-muted/90  text-muted-foreground w-/4 sm:w-72 h-8 rounded-md p-2"
                    onChange={(e) => {

                        setQuery(e.target.value)

                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            movieList()
                        }
                    }}
                />


                {/* <Button
                    className="w-18 align-middle h-8 ml-2"
                    onClick={() => movieList()}
                >
                    Search
                </Button> */}
                <Button
                    variant="secondary"
                    className="w-24 align-middle ml-4 h-8 bg-destructive/50 hover:bg-destructive/80 text-danger-foreground"
                    onClick={() => setResults([])}
                >
                    Clear
                </Button>
            </div>

            {/* <GenreFilterDropdown setFilter={setGenreFilter} /> */}

            {
                results.length > 0 && !loading &&
                // <div id="search-popover" popover="auto" popovertargetaction="show" >

                <ScrollArea className=" z-40 w-5/8 h-[60vh] sm:max-h-[600px] sm:max-w-5xl bg-card/80 rounded-lg py-4 px-2 mx-2 sm:m-auto shadow-xl shadow-black">


                    <div className="grid grid-cols-2 sm:flex  lg:flex-row lg:flex-wrap justify-center gap-4 items-center place-items-center lg:w-full m-auto">
                        {loading ? (

                            <SkeletonMediaSearchCard />

                        ) : (


                            results.slice(0, resultsLength).map((result) => (
                                <NewSearchCard key={result.id} media={result} userProviders={user?.providers} />
                            ))
                            
                                
                            )
                            
                            }
                            {moreResults &&
                            <Button
                                asChild
                                variant="link"
                                disabled
                                className=" col-span-2 sm:col-span-1text-foreground/60 hover:text-foreground/80 cursor-pointer"
                            >
                            <Link href="" >
                                More Results... 
                                <br />
                            (Coming Soon)
                            </Link>
                            </Button>
                            }

                    </div>

                </ScrollArea>
                // </div>
            }






        </div >
        // </div >
    )
}

export default NewSearchBar
