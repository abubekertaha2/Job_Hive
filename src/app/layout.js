import "./globals.css";
import React from 'react';
import Head from 'next/head';
import Nav from './components/Nav';
import Footer from './components/Footer';

export const metadata = {
  title: "Job Board",
  description: "This is a description of my page.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favico.ico" /> 
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>
        <div className="main">
          <div className="gradient">
            {/* Additional content can go here */}
          </div>
        </div>
          <Nav />
          {children}
          <Footer />

      </body>
    </html>
  );
}