'use client';

import React, { useState } from 'react';
import Hero from '../components/hero';
import Header from '../components/header';
import Footer from '../components/footer';


export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}

