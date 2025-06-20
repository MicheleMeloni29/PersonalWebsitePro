'use client';

import React, { useState } from 'react';
import Hero from './components/hero';
import About from './components/about';
import TimeLine from './components/timeline';
import MyProjects from './components/myprojects';
import Contact from './components/contacts';
import Footer from './components/footer';


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
          {<TimeLine />}
        </section>
        <section id="projects">
          {<MyProjects />}
        </section>
        <section id="contact">
          <Contact />
        </section>
        <Footer />
      </main>
    </>
  );
}


