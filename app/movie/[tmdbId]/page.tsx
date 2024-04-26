import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import Link from 'next/link';
import CastAndCrew from '@/components/CastAndCrew';
import ProvidersBlock from '@/components/ProvidersBlock';
import AddWatchlistButton from '@/components/buttons/AddWatchlistButton';
import BackButton from '@/components/buttons/BackButton';
import { TMDBApiMovieDetail, tmdbFetchOptions } from "@/lib/tmdb";

interface DetailPageProps {
  params: {
    tmdbId: string;
  }
}

const DetailPage = async ({ params }: DetailPageProps) => {
  const { tmdbId } = params;
  const tmdbType = 'movie';

  const url = `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?append_to_response=credits&language=en-US`;
  const response = await fetch(url, tmdbFetchOptions);
  const data: TMDBApiMovieDetail = await response.json();

  const addButtonData = {
    id: data.id,
    title: data.title,
    poster_path: data.poster_path,
  };

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-12">
      <BackButton className="mb-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Poster Image */}
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
            alt={data.title}
            className="w-full"
            width={500}
            height={750}
            priority
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-sm p-2">
            Release Date: {data.release_date}
          </div>
        </div>

        {/* Movie Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-gray-600">{data.tagline}</p>
          <p className="text-gray-700">{data.overview}</p>

          <div className="flex items-center gap-2">
            <Label htmlFor="streaming">Streaming on</Label>
            <ProvidersBlock tmdbId={data.id} tmdbType={tmdbType} iconSize={48} />
          </div>

          {data.vote_average > 0 && (
            <p>
              Score: {data.vote_average.toFixed(1)}/10{" "}
              <span className="text-foreground/50 text-sm">({data.vote_count} votes)</span>
            </p>
          )}

          {data.genres?.length > 0 ? (
            <p>Genres: {data.genres.map((genre) => genre.name).join(", ")}</p>
          ) : (
            <p>No genres available</p>
          )}

          <p>Language: {data.original_language}</p>
          <p>Revenue: ${data.revenue.toLocaleString()}</p>
          <p>Budget: ${data.budget.toLocaleString()}</p>
          <p>Status: {data.status}</p>
          <p>Runtime: {data.runtime} minutes</p>
        </div>
      </div>

      {/* Accordion Section */}
      <Accordion type="single" collapsible>
        {data.production_countries?.length > 0 && (
          <AccordionItem value="Production Countries">
            <AccordionTrigger>
              <h3 className="text-lg font-bold">Production Countries</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                {data.production_countries.map((country) => (
                  <p key={country.iso_3166_1}>{country.name}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {data.production_companies?.length > 0 && (
          <AccordionItem value="Production Companies">
            <AccordionTrigger>
              <h3 className="text-lg font-bold">Production Companies</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                {data.production_companies.map((company) => (
                  <p key={company.id}>{company.name}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Cast and Crew Section */}
      <CastAndCrew cast={data.credits.cast} type="cast" />

      {/* External Links */}
      <div className="pt-6">
        <h3 className="text-lg font-bold">External Links</h3>
        <div className="flex divide-x divide-gray-400">
          <Button variant="link" asChild>
            <Link
              href={`https://www.imdb.com/title/${data.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              IMDB
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link
              href={data.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              Homepage
            </Link>
          </Button>
        </div>
      </div>

      {/* Hidden Button */}
      <div className="hidden">
        <AddWatchlistButton media={addButtonData} tmdbId={tmdbId} />
      </div>
    </div>
  );
};

export default DetailPage;
