import { UserContextProvider } from "@/contexts/UserContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

function SavedPostsPage() {
  const [posts, setPosts] = useState([]);
  const session = useSession(null);
  const supabase = useSupabaseClient(null);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase?.from('saved_posts').select('post_id').eq('user_id', session?.user?.id).then(result => {
      const postsIds = result?.data?.map(item => item?.post_id);
      supabase?.from('posts').select('*, profiles(*)').in('id', postsIds).then(result => setPosts(result?.data));
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return (
    <Layout>
      <UserContextProvider>
        <h1 className="text-6xl mb-4 text-black">Postări Salvate</h1>
        {posts?.length > 0 && posts?.map(post => (
          <div key={post.id}>
            <PostCard {...post} />
          </div>
        ))}
      </UserContextProvider>
    </Layout>
  );
}

export default SavedPostsPage;