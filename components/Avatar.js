/* eslint-disable @next/next/no-img-element */

import { uploadUserProfileImage } from "@/helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Preloader from "./Preloader";
import { useState } from "react";

export default function Avatar({size,url,editable,onChange}) {
    const supabase = useSupabaseClient(null);
    const session = useSession(null);
    const [isUploading, setIsUploading] = useState(false);
    async function handleAvatarChange(ev) {
      const file = ev.target?.files?.[0];
      if(file) {
        setIsUploading(true);
        await uploadUserProfileImage(supabase, session?.user?.id, file, 'avatars', 'avatar');
        setIsUploading(false);
        if(onChange) onChange();
      }
    }
  
    let width = 'w-12';
    if (size === 'lg') {
      width = 'w-24 md:w-36';
    }
    return (
      <div className={`${width}`}>
        <div className="rounded-full overflow-hidden">
          <img src={url} alt="" className="w-full" />
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center bg-white bg-opacity-50 rounded-full">
            <div className="inline-block mx-auto">
               <Preloader />
            </div>
          </div>
        )}
        {editable && (
          <label className="absolute bottom-0 right-0 shadow-md shadow-gray-500 p-2 bg-likeColor rounded-full cursor-pointer">
            <input type="file" className="hidden" onChange={handleAvatarChange} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>


          </label>
        )}
      </div>
    );
  }