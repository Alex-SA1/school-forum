import '@/styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import {useState} from "react";
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => {
    return createBrowserSupabaseClient();
  })
  return (
    <SessionContextProvider 
    supabaseClient={supabaseClient}
    initialSession={pageProps?.initialSession}>

      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export async function getStaticProps({ params: {slug} }) {
  console.log(`Building slug: ${slug}`)
}

export default App;