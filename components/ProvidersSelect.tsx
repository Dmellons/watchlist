import { account, } from "@/lib/appwrite";
import { tmdbFetchOptions } from "@/lib/tmdb";
import { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
    currentProviders: number[];
};

type ProviderInfo = {
    display_priorities: {
        [key: string]: number;
    };
    display_priority: number;
    logo_path: string;
    provider_name: string;
    provider_id: number;
};

export default function ProvidersSelect() {

    // Base Providers = [8,15,9,337,1899,283]
    const [providers, setProviders] = useState<number[] | undefined>();
    const [search, setSearch] = useState<string>('');
    const [availableProviders, setAvailableProviders] = useState<ProviderInfo[] | null>(null);

    useEffect(() => {
        const getPrefs = async () => {

            const prefs = await account.getPrefs()
            if (!prefs?.providers) {

                await account.updatePrefs({ providers: '0', ...prefs })
            }
            
        }
        getPrefs()
        })
    useEffect(() => {
        const fetchData = async () => {
            let prefs = await account.getPrefs();
            if (!prefs?.providers) {
                await account.updatePrefs({ providers: '0', ...prefs })
                prefs = { providers: '0', ...prefs }
            }
           
            if (prefs.providers && typeof prefs.providers === 'string') {
                const providersArray = prefs.providers.split(',').map(Number)
                console.log({ providersArray })
                setProviders(providersArray);
            } else {
                setProviders(prefs.providers);
            }




            const response = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region=US&query=${search}`, tmdbFetchOptions);
            const data: { results: ProviderInfo[] } = await response.json();
            
            setAvailableProviders(data.results);
            //   setProviders(prefs.providers || []);
        };
        fetchData();
    }, [search]);

    useEffect(() => {
        const handleSave = async () => {
            if (providers) {
                // if (providers[0] === 0 && providers.length === 1) {
                //     await account.updatePrefs({ providers: '0' })
                // }
                const prefs = await account.getPrefs();

            
                await account.updatePrefs({ ...prefs, providers });
            }
        };
        handleSave();
    }, [providers]);


    return (
        <>
            <div className="gap-2 flex flex-col my-4 border rounded-lg border-gray-300 p-2">
                <Label className="text-sm text-center">Your Providers</Label>
                <div className="flex flex-wrap gap-3 max-w-96  items-center justify-center w-full m-auto">
                    {providers && providers.map((providerId) => {
                        const provider = availableProviders?.find((p) => p.provider_id === providerId);
                        return provider ? (

                            <div
                                key={provider.provider_id}
                                // onClick={() => {
                                //     const isChecked = providers.includes(provider.provider_id);
                                //     if (isChecked) {
                                //         setProviders(prevProviders =>
                                //             prevProviders.filter(p => p !== provider.provider_id)
                                //         );
                                //     } else {
                                //         setProviders(prevProviders => [...prevProviders, provider.provider_id]);
                                //     }
                                // }}
                                className="flex flex-col items-center mt-4"
                            >
                                <Image
                                    src={`https://image.tmdb.org/t/p/h632/${provider.logo_path}`}
                                    alt={provider.provider_name}
                                    width={50}
                                    height={50}
                                    className={`${providers.includes(provider.provider_id) ? '' : ''}`}
                                />
                                <span
                                    className="text-xs text-center"
                                >

                                    {provider.provider_name}
                                </span>
                            </div>
                        ) : null;
                    })}
                
            <Dialog>
                <DialogTrigger className="flex flex-col items-center">
                    <Button
                        variant="outline"
                        className="w-[50px] h-[50px] mt-4 bg-card "
                    >
                        <Plus /> 
                    </Button>
                    <Label className="text-xs text-center">Edit Providers</Label>
                </DialogTrigger>
                <DialogContent className="w-4/5 rounded-xl sm:w-full ">
                    <DialogTitle>
                        Add Providers
                    </DialogTitle>
                    <DialogDescription>
                        <div className="gap-2 flex flex-col mt-4">
                            <Label className="text-sm text-center">Tap to remove</Label>
                            <div className="flex flex-wrap gap-3 max-w-96  justify-center w-full m-auto">
                                {providers && providers.map((providerId) => {
                                    const provider = availableProviders?.find((p) => p.provider_id === providerId);
                                    return provider ? (

                                        <div
                                            key={provider.provider_id}
                                            onClick={() => {
                                                const isChecked = providers.includes(provider.provider_id);
                                                if (isChecked) {
                                                    setProviders(prevProviders =>
                                                        prevProviders.filter(p => p !== provider.provider_id)
                                                    );
                                                } else {
                                                    setProviders(prevProviders => [...prevProviders, provider.provider_id]);
                                                }
                                            }}
                                            className="flex flex-col items-center cursor-pointer mt-4"
                                        >
                                            <Image
                                                src={`https://image.tmdb.org/t/p/h632/${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width={50}
                                                height={50}
                                                className={`${providers.includes(provider.provider_id) ? '' : ''}`}
                                            />
                                            <span
                                                className="text-xs text-center"
                                            >

                                                {provider.provider_name}
                                            </span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </DialogDescription>
                    <Label className="mt-4">Filter</Label>
                    <Input
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="max-w-lg bg-popover/75"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2sm:gap-4 mt-8 place-items-center max-h-96 overflow-y-auto overflow-x-hidden ">
                       
                            {availableProviders && providers &&
                                availableProviders
                                    .filter((provider) =>
                                        provider.provider_name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .sort((a, b) => a.provider_name.localeCompare(b.provider_name))
                                    .map((provider) => (
                                        
                                        <div
                                            key={provider.provider_id}
                                            onClick={() => {
                                                const isChecked = providers.includes(provider.provider_id);
                                                if (isChecked) {
                                                    setProviders(prevProviders =>
                                                        prevProviders.filter(p => p !== provider.provider_id)
                                                    );
                                                } else {
                                                    setProviders(prevProviders => [...prevProviders, provider.provider_id]);
                                                }
                                            }}
                                            className="flex flex-col items-center cursor-pointer mt-4"
                                        >
                                            <Image
                                                src={`https://image.tmdb.org/t/p/h632/${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width={50}
                                                height={50}
                                                className={` ${providers.includes(provider.provider_id) ? 'border-2 border-primary ' : ''}`}
                                            />
                                            <span
                                                className="text-xs text-center m-w-6 truncate"
                                            >

                                                {provider.provider_name}
                                            </span>
                                        </div>
                                    ))
                            }

                        
                    </div>
                </DialogContent>
            </Dialog>
            </div>
            </div>
        </>
    );
}



