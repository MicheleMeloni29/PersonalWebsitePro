"use client";
import ProfileCard from "./profileCard";

export default function Hero() {
    const handleContactClick = () => {
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-8">
            <ProfileCard
                name="Michele Meloni"
                role="Frontend Developer"
                location="Sestu, Sardinia (IT)"
                photo="profileIMGReal.png"
                bio="I build modern web & mobile apps. Passionate about UI/UX and performance."
                imageScale={0.95}           // rimpicciolisce
                imageInset={12}             // piccolo bordo interno
                objectPosition="50% 60%"        // centra l'immagine'
                imageOffsetY={0}          // sposta l'immagine verso l'alto
                imageOpacity={0.3}          // opacità dell'immagine
            />
        </section>
    );
}