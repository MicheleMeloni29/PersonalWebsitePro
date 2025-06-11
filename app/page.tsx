'use client';

import React, { useState } from 'react';
import Hero from '../components/hero';
import Header from '../components/header';
import Footer from '../components/footer';
import About from '../components/about';


export default function Homepage() {
  return (
    <>
      <main className="scroll-smooth">
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          {<About />}
        </section>
        <section id="timeline">
          {/*<Timeline />*/}
        </section>
        <section id="projects">
          {/*<Projects />*/}
        </section>
        <section id="contact">
          {/*<Contact />*/}
        </section>
        <Footer />
      </main>
    </>
  );
}


