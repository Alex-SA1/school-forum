import PostCard from "./PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function ProfileContent({activeTab,userId}) {

  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if(!userId) {
      return;
    }
    if(activeTab === 'posts'){
      loadPosts().then(()=> {});
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPosts() {
    const posts = await userPosts(userId);
    const profile = await userProfile(userId);
    setPosts(posts);
    setProfile(profile);
  }

  async function userPosts(userId) {
    const {data} = await supabase.from('posts').select('id, content, created_at, author, photos').eq('author', userId).order('created_at', {ascending: false});
    
    return data;
  }

  async function userProfile(userId) {
    const {data} = await supabase.from('profiles').select().eq('id', userId);
    return data[0];
  }


    return (
        <div>
          {activeTab === 'posts' && (
            <div>
              {posts?.length > 0 && posts?.map(post => (
                <PostCard key={'post.created_at'} {...post} profiles={profile} />
              ))}
            </div>
          )}
          
        </div>
    )
}