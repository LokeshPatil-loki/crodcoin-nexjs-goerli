import React from "react";
import Head from "next/head";
import 'semantic-ui-css/semantic.min.css'
const MyApp = ({ Component, pageProps }) => {
  return (
    <>
        <Head>
          <title>App</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Component {...pageProps} />
    </>
  );
}


export default MyApp;
