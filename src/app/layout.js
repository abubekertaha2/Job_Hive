import "./globals.css";
import React from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

export const metadata = {
  title: "Job Board",
  description: "This is a description of my page.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favico.ico" /> 
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <UserProvider>
          <div className="main">
            <div className="gradient">
              {/* Additional content can go here */}
            </div>
          </div>
          <Nav />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}