'use client'
import { TMDBMultiSearchResult } from "@/types/tmdbApi"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import ProvidersBlock from "./ProvidersBlock"
import AddWatchlistButton from "./buttons/AddWatchlistButton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import Link from "next/link"
import { useUser } from "@/hooks/User"


type CardData = {
    title: string,
    content_type: string,
    tmdb_id: number,
    tmdb_type: string,
    year: string,
    poster_path: string,
    backdrop_path: string,
    description: string,

}
let data: CardData



const NewSearchCard = ({
    media,
    userProviders
}: {
    media: TMDBMultiSearchResult
    userProviders?: number[]
}) => {

    const { user } = useUser()

    if (media.media_type === 'person') {
        data = {
            title: media.name,
            content_type: media.media_type,
            tmdb_id: media.id,
            tmdb_type: media.media_type,
            year: media.release_date,
            poster_path: media.poster_path,
            backdrop_path: media.backdrop_path,
            description: media.overview ? media.overview : "No description available"
        }
        return null
    }


    if (media.media_type === 'tv') {
        data = {
            title: media.name,
            content_type: media.media_type,
            tmdb_id: media.id,
            tmdb_type: media.media_type,
            year: media.first_air_date,
            poster_path: media.poster_path,
            backdrop_path: media.backdrop_path,
            description: media.overview ? media.overview : "No description available"
        }

    }

    if (media.media_type === 'movie') {
        data = {
            title: media.title,
            content_type: media.media_type,
            tmdb_id: media.id,
            tmdb_type: media.media_type,
            year: media.release_date,
            poster_path: media.poster_path,
            backdrop_path: media.backdrop_path,
            description: media.overview ? media.overview : "No description available"
        }
    }

   


    return (
        <Dialog>
            <DialogTrigger>
                <Image
                    src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
                    alt={data.title}
                    className="rounded-lg contain group-hover:border-2 group-hover:border-primary group-hover:scale-105 group-hover:ease-in-out group-hover:duration-300 w-full h-full"
                    width={200}
                    height={200}
                />
                <div className="mt-2">
                    <ProvidersBlock tmdbId={data.tmdb_id} tmdbType={data.tmdb_type} userProviders={userProviders}
                    // maxWidth="w-48"
                    />

                </div>

            </DialogTrigger>
            <DialogContent className="w-4/5">
                <DialogHeader>
                    <Image
                        src={`https://image.tmdb.org/t/p/w500/${data.backdrop_path}`}
                        alt={data.title}
                        className="rounded-lg w-full my-4"
                        width={200}
                        height={50} />
                    <DialogTitle className="flex justify-between ">

                        {data.title}

                        <div className="text-card-foreground text-sm pl-2">
                            {data.year.split('-')[0]}
                        </div>


                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <h3 className="underline">Description:</h3>
                    <p>{data.description}</p>


                </DialogDescription>

                <Button asChild >
                    <Link href={`/${data.tmdb_type}/${data.tmdb_id}`} >
                        More Info
                    </Link>
                </Button>

                <AddWatchlistButton media={media} query={true} />
                {/* {data.tmdb_type === 'tv' &&
                            <Button asChild variant={"ghost"} >
                                <Link href={`/${data.tmdb_type}/${data.tmdb_id}`} >
                                    More Info
                                </Link>
                            </Button>
                        } */}

                <ProvidersBlock tmdbId={data.tmdb_id} tmdbType={data.tmdb_type} userProviders={userProviders} />

            </DialogContent>
        </Dialog>
    )
}

export default NewSearchCard