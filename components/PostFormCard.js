/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import Card from "./Card";
import Avatar from "./Avatar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import Preloader from "./Preloader";
import Link from "next/link";

export default function PostFormCard({onPost}) {
  const [content, setContent] = useState('');
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = useSupabaseClient(null);
  const session = useSession(null);
  const {profile} = useContext(UserContext);
  

  function createPost() {
    supabase.from('posts').insert({
      author: session.user.id,
      content, 
      photos: uploads, 
    }).then(response => {
      if(!response.error) {
        setContent('');
        setUploads([]);
        if(onPost) {
          onPost();
        }
      }
    });
  }

  async function addPhotos(ev) {
    const files = ev.target.files;
    if(files.length > 0) {
      setIsUploading(true);
      for(const file of files) {
        const newName = Date.now() + file.name;
        const result = await supabase.storage.from('photos').upload(newName, file);

        if(result.data) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
          setUploads(prevUploads => [...prevUploads, url]);
        } 
      }
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <div className="flex gap-2">
      <Link href={`/profile/${session?.user?.id}/posts`}>
        <div>
          <Avatar url={profile?.avatar} />
        </div>
      </Link>
        {profile && (
          <textarea value={content} 
          onChange={e => setContent(e?.target?.value)}
          className="grow p-3 h-14 rounded-md bg-inputColor" placeholder={`${profile && profile?.name ? profile?.name : 'User'}, ai vreo întrebare de pus comunității?`} />
        )}
      </div>
      {isUploading && (
        <div>
          <Preloader />
        </div>
      )}
      {uploads.length > 0 && (
      <div className="flex gap-2">
        {uploads && uploads?.map(upload => (
          <div className="mt-2">
             <img src={upload} alt="" className="w-auto h-24 rounded-md" />
          </div>
        ))}
      </div>
      )}
      <div className="flex gap-5 items-center mt-2">
        <div>
          <label className="flex gap-1">
            <input type="file" className="hidden" multiple onChange={addPhotos} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-black">
               <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
            </svg>

            <span className="hidden md:block text-black">Poze</span>
          </label>
        </div>
        <div className="grow text-right">
          <button onClick={createPost} className="bg-postColor text-white px-6 py-1 rounded-md">Postează</button>
        </div>
      </div>
    </Card>
  );
}