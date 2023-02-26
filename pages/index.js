import Layout from "../components/Layout";
import PostFormCard from "../components/PostFormCard";
import PostCard from "../components/PostCard";
import { useSession } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useEffect } from "react";
import { UserContext } from "@/contexts/UserContext";

function Home() {
  const supabase = useSupabaseClient(null);
  const session = useSession(null);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);


  useEffect(() => {
    fetchPosts();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase?.from('profiles').select().eq('id', session?.user?.id).then(result => {
      if (result?.data?.length) {
        setProfile(result?.data[0]);
      }
    });
  }, [session?.user?.id, supabase]);

  if (!session) {
    return <LoginPage />;
  };

  function fetchPosts() {
    supabase?.from('posts').select('id, content, created_at, photos, profiles(id, avatar, name)').is('parent', null).order('created_at', { ascending: false }).then(result => {
      setPosts(result?.data);
    });
  };

  return (
    <Layout>
      <UserContext.Provider value={{ profile }}>
        <PostFormCard onPost={fetchPosts} />
        {posts?.length > 0 && posts?.map(post => (
          <PostCard key={post?.id} {...post} />
        ))}
      </UserContext.Provider>

    </Layout>
  );
}

export default Home;