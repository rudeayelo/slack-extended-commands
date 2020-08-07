import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@rudeland/ui";
import { AuthProvider } from "src/providers/AuthProvider";

const App = ({ Component, pageProps, router }) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/icon-512.png" />
      <link rel="manifest" href="/manifest.json" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#fffff" />

      <title>Slack Extended Commands</title>
    </Head>
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} key={router.route} />
      </AuthProvider>
    </ThemeProvider>
  </>
);

export default App;
