'use client'
import ImageGetter from "@/components/ImageGetter";
import PlexRequestsBlock from "@/components/PlexRequestsBlock";
import ProvidersBlock from "@/components/ProvidersBlock";
import ProvidersSelect from "@/components/ProvidersSelect";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/hooks/User";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user } = useUser();
  const [isTester, setIsTester] = useState(undefined);

  const handleToggleTester = () => {
    setIsTester(!isTester);
  };

  useEffect(() => {
    if (user) {
      const labels = user.labels || [];
      if (labels.includes('tester')) {
        setIsTester(true);
      } else {
        setIsTester(false);
      }
      console.log(labels.includes('tester'));

    }
  }, [user]);


  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <ImageGetter />
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          { user.admin && <p>Admin: {user.admin ? "Yes" : "No"}</p>}
          <ProvidersSelect />
    
          <h2 className="text-md">Labels:</h2>
          <div className="border flex justify-center gap-2 p-2 border-gray-200 rounded-lg">
            {user.labels?.map(label => (
              <Badge key={label}>{label}</Badge>
            ))}
          </div>

        </div>
      )} {!user && <p>No user found</p>}


    </div>
  );
};

export default ProfilePage;
