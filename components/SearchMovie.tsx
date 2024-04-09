'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import MediaSearchCard from "./MediaSearchCard"
import { TMDBMultiSearchResult } from "@/types/tmdbApi"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

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
                placeholder="Movie, TV Show, Person..."
                value={query}
                className="bg-white/90  text-black w-80"
                onChange={(e) => {
                    setQuery(e.target.value)
                    movieList()
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        movieList()
                    }
                }}
            />
            <div className="flex gap-2">

                <Button
                    className="my-5 w-24 align-middle"
                    onClick={() => movieList()}
                >
                    Search
                </Button>
                <Button
                    className="my-5 w-24 align-middle"
                    onClick={() => setResults([])}
                >
                    Clear
                </Button>
            </div>


            <div className="p-3 my-4 w-full">
                {/* <div className="flex flex-col w-full gap-4 items-center"> */}
                {/* {results.length === 0 && <div>No results</div>} */}
                {results.length > 0 &&
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full sm:min-w-96" >
                        <AccordionItem value="item-1" >
                            <AccordionTrigger>Results!</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col p-3 gap-4 items-center w-full">

                                    {results.map((result) => (
                                        <MediaSearchCard key={result.id} media={result} />
                                    ))}
                                </div>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>


                }
                {/*
                <Carousel >
                    <CarouselContent >

                        {results.map((result) => (
                            <CarouselItem className="basis-1/4  hover:z-0 pl-4 -ml-4" key={result.id}>
                                <MediaSearchCard key={result.id} media={result} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                 </div> */}
            </div>

        </div>
    )
}

export default SearchMovie
