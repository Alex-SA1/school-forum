import Card from "./Card";
import {useRouter} from "next/router";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function NavigationCard(){
  const router = useRouter(null);
  const {asPath:pathname} = router;
  const activeElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-3 my-1 bg-inputColor text-textColor md:-mx-7 px-6 md:px-7 rounded-md shadow-md items-center';
  const nonActiveElementClasses= 'text-sm md:text-md flex text-black gap-1 md:gap-3 py-2 my-2 hover:bg-buttonHoverColor hover:bg-opacity-10 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center';
  const session = useSession();
  

  const supabase = useSupabaseClient();


  async function logout(){
    await supabase?.auth.signOut();
  }

  
  
  return (
    <Card noPadding={true}>
      <div className="px-4 py-2 z-10 flex justify-between md:block shadow-md md:shadow-none">
        <h2 className="text-black mb-3 hidden md:block">Navigare</h2>

        <Link href="https://school-forum-presentation-page.vercel.app/" className={pathname === "https://school-forum-presentation-page.vercel.app/" ? activeElementClasses : nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>

          <span className="hidden md:block">Pagina de Start</span>
        </Link>

        <Link href="/" className={pathname === "/" ? activeElementClasses : nonActiveElementClasses}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="hidden md:block">Acasă</span>
        </Link>

        <Link href="/saved" className={pathname === "/saved" ? activeElementClasses : nonActiveElementClasses}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <span className="hidden md:block">Postări salvate</span>
        </Link>

        <Link href={`/profile/${session?.user?.id}/posts`} className={pathname === `/profile/${session?.user?.id}/posts` ? activeElementClasses : nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

          <span className="hidden md:block">Contul meu</span>
        </Link>
        

        <button onClick={logout} className="w-full -my-2">
        <span className={nonActiveElementClasses}> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="hidden md:block">Logout</span>
        </span>
        </button>
      </div>
    </Card>
  );
}
