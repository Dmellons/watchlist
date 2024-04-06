'use client'
import { ProvidersApiCall, Results, StreamingInfo, tmdbFetchOptions } from '@/lib/tmdb';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const ProvidersBlock = (
  {
    tmdbId,
    tmdbType,
    country = 'US',
    userProviders
  }: {
    tmdbId: number
    tmdbType: string
    country?: string,
    userProviders?: string[]
  }
) => {
  const [data, setData] = useState<ProvidersApiCall | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.themoviedb.org/3/${tmdbType}/${tmdbId.toString()}/watch/providers`;
        console.log(url)
        const response = await fetch(url, tmdbFetchOptions);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error({ error })
      }
    };

    fetchData();
  }, []);
  if (!data) {
    return null;
  } else if (data.results[country] === undefined) {
    return null;
  }
  return (
    <div className='w-full m-auto'>
      <h3 className='text-xl font-bold text-center mb-2'>Streaming on</h3>
      <div className='flex gap-4 justify-center flex-wrap'>
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : (
          data?.results[country]?.flatrate?.map((provider:StreamingInfo, key:number) => (
            <div key={key} className='flex items-center justify-center'>
              <Image 
                src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} 
                alt={provider.provider_name} 
                width={48} 
                height={48} 
                />
            </div>
          ))

        )
        }
      </div>
      <div className='font-extralight text-[10px] text-center text-muted '>Streaming results provided by JustWatch</div>
    </div>
  )
}

export default ProvidersBlock;