/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */

import Avatar from "./Avatar";
import Card from "./Card";
import ClickOutHandler from 'react-clickout-handler'
import {useState} from "react";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import Preloader from "./Preloader";

export default function PostCard({id, content,created_at,photos,profiles:authorProfile}) {
  const [dropdownOpen,setDropdownOpen] = useState(false);

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);



  const [comments, setComments] = useState([]);
  
  const [commentText, setCommentText] = useState('');
  const {profile: myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  //poze comentarii
  const [uploads, setUploads] = useState([]);



  useEffect(() => {
    fetchLikes();
    fetchDislikes();
    fetchComments(); 
    if(myProfile?.id) fetchIsSaved();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProfile?.id]);

  function fetchIsSaved() {
    supabase?.from('saved_posts').select().eq('post_id', id).eq('user_id', myProfile?.id).then(result => {
      if(result?.data?.length > 0) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    })
  }

  function fetchLikes() {
    supabase?.from('likes').select().eq('post_id', id).then(result => setLikes(result?.data));
  }

  function fetchDislikes() {
    supabase?.from('dislikes').select().eq('post_id', id).then(result => setDislikes(result?.data));
  }

  function fetchComments() {
    supabase?.from('posts').select('*, profiles(*)').eq('parent', id).then(result => {
      setComments(result?.data);
    });
  }


  function openDropdown(e) {
    e.stopPropagation();
    setDropdownOpen(true);
  }
  function handleClickOutsideDropdown(e) {
    e.stopPropagation();
    setDropdownOpen(false);
  }
  function toggleSave() {
    if (isSaved) {
      supabase?.from('saved_posts')
        .delete()
        .eq('post_id', id)
        .eq('user_id', myProfile?.id)
        .then(() => {
          setIsSaved(false);
          setDropdownOpen(false);
        });
    }
    if (!isSaved) {
      supabase?.from('saved_posts').insert({
        user_id:myProfile?.id,
        post_id:id,
      }).then(() => {
        setIsSaved(true);
        setDropdownOpen(false);
      });
    }
  }
  const isLikedByMe = !!likes.find(like => like?.user_id === myProfile?.id);
  const isDislikedByMe = !!dislikes.find(dislike => dislike?.user_id === myProfile?.id);

  function toggleLike() {
    if(isLikedByMe){
      supabase?.from('likes').delete().eq('post_id', id).eq('user_id', myProfile?.id).then(() => {  
      fetchLikes();
      });
      return;
    }
    supabase?.from('likes').insert({
      post_id: id,
      user_id: myProfile?.id,
    }).then(() => {
      fetchLikes();
    })
  }

  function toggleDislike() {
    if(isDislikedByMe){
      supabase?.from('dislikes').delete().eq('post_id', id).eq('user_id', myProfile?.id).then(() => {
        fetchDislikes();
      });
      return;
    }
    supabase?.from('dislikes').insert({
      post_id: id,
      user_id: myProfile?.id,
    }).then(() => {
      fetchDislikes();
    })
  }


  async function addPhotosComment(ev) {
    const files = ev?.target?.files;
    if(files.length > 0) {
      setIsUploading(true);
      for(const file of files) {
        const newName = Date.now() + file.name;
        const result = await supabase?.storage?.from('photoscomment').upload(newName, file);

        if(result.data) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photoscomment/' + result?.data?.path;
          setUploads(prevUploads => [...prevUploads, url]);
        } 
      }
      setIsUploading(false);
    }
  }

  function postCommentPhoto() {
    supabase?.from('posts').insert({
      author: myProfile?.id,
      photos: uploads,
      parent: id,
    }).then(result => {
      fetchComments();
      if(!result.error) {
        setUploads([]);
      }
    })
  }

  function postComment(ev) {
    ev.preventDefault();
    supabase?.from('posts').insert({
      content: commentText,
      author: myProfile?.id,
      parent: id,
    }).then(() => {
      fetchComments();
      setCommentText('');
    })
  }

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={`/profile/${authorProfile?.id}/posts`}>
            <span className="cursor-pointer">
              <Avatar url={authorProfile?.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow text-black">
          <p>
            <Link href={`/profile/${authorProfile?.id}`}>
              <span className="mr-1 text-black font-semibold cursor-pointer hover:underline">
                {authorProfile?.name}
              </span>
            </Link>
            a publicat
          </p>
          <p className="text-gray-500 text-sm">
            
            <ReactTimeAgo date={(new Date(created_at)).getTime()} className="text-black" />
          </p>
        </div>
        <div className="relative">
          <button className="text-gray-400" onClick={openDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 fill-likeColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          </button>
          {dropdownOpen && (
            <div className="bg-red w-5 h-5 absolute top-0"></div>
          )}
          <ClickOutHandler onClickOut={handleClickOutsideDropdown}>
            <div className="relative">
              {dropdownOpen && (
                <div className="absolute -right-6 shadow-md p-3 rounded-sm w-52 bg-dropdownMenuColor">
                  <button onClick={toggleSave} className="block w-full">
                    <span className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md ">
                      {!isSaved && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                      )}
                      {isSaved && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                        </svg>
                      
                      )}
                      {isSaved ? 'Elimină din salvate' : 'Salvează postarea'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </ClickOutHandler>
        </div>
      </div>
      <div>
        <p className="my-3 text-sm text-xl text-black">{content}</p>
        {photos?.length > 0 && (
          <div className="flex gap-4">
            {photos && photos?.map(photo => (
              <div key={photo} className="">
                <img src={photo} className="rounded-md" alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-8">

        {!isDislikedByMe && (
        <button className="flex gap-2 items-center" onClick={toggleLike}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-6 h-6 " + (isLikedByMe ? 'fill-likeColor' : '')}>
            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
        </svg>

        <span className="text-black">
          {likes?.length}
        </span>
        </button>
        )}

        {!isLikedByMe && (
        <button className="flex gap-2 items-center" onClick={toggleDislike}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-6 h-6 " + (isDislikedByMe  ? 'fill-likeColor' : '')}>
           <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
        </svg>

        <span className="text-black">
          {dislikes?.length}
        </span>  
        </button>
        )}

        <button className="flex gap-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-likeColor">
            <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
          </svg>

          <span className="text-black">
          {comments?.length}
          </span>
        </button>
      </div>
      <div className="flex mt-4 gap-3">
        <div>
          <Avatar url={myProfile?.avatar} />
        </div>
        <div className="grow rounded-full relative">
          <form onSubmit={postComment} className="z-0">
             <input
                value={commentText}
                onChange={ev => setCommentText(ev?.target?.value)} 
                className="block w-full p-3 px-4 z-0 overflow-hidden h-12 rounded-full bg-inputColor " placeholder="Scrie un comentariu..."/>
          </form>

        <div className="absolute top-3 right-3 text-gray-400">
          
          

          <label className="flex gap-1">

            

            <input type="file" className="hidden" multiple 
            onChange={addPhotosComment} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>

            {uploads.length > 0 && (
            <button onClick={postCommentPhoto} className="">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
             </svg>
            </button>
            )}

            
          </label>

          

        </div>
        

        </div>
      </div>
      <div>
      {isUploading && (
        <div>
          <Preloader />
        </div>
      )}
      {uploads?.length > 0 && (
            <div className="flex gap-2">
                {uploads?.map(upload => (
            <div className="mt-2">
              <img src={upload} alt="" className="w-auto h-24 rounded-md" />
            </div>
        ))}
      </div>
      )}

        {comments?.length > 0 && comments?.map(comment => (
          <div key={comment.id} className="mt-2 flex gap-2 items-center">
            <Avatar url={comment?.profiles?.avatar} />
            <div className="bg-commentColor py-1.5 px-4 rounded-3xl">
            <div>
            <Link href={`/profile/${comment?.profiles?.id}`}>
              <span className="hover:underline font-semibold mr-1">
                {comment?.profiles?.name}
              </span>
            </Link>
            <span className="text-sn">
               <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment?.created_at)).getTime()} />
            </span>
            </div> 
            {comment?.content === null ? (
            <img src={comment.photos} alt="" className="w-auto h-24 rounded-md" />
            ) : (
              <p className="text-1xl">{comment?.content}</p>
            )}
            </div>
          </div>
        ))}

        
        
        

        
        
      </div>
    </Card>
  );
}