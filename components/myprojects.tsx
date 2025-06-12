'use client';

export default function MyProjects() { 
    return (
        <section
            id="projects"
            className="min-h-[calc(100vh-64px-40px)] flex items-center justify-center pb-102 px-6 text-white"          //mian-h-[calc(100vh-64px-40px)] for full height minus header and footer
        >
            <div className="max-w-3xl text-left">
                <h2 className="text-3xl md:text-4xl font-bold  mb-6 text-red-800">My Projects</h2>
                    {/* NO PROJECT FOR NOW */}
                    <div className="text-red-900">
                        <p className="text-lg">Currently, I don't have any projects to showcase. Stay tuned!</p>
                    </div>
                </div>
            
        </section>
     )
}