// components/AnimatedBackground.tsx
'use client';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0d0d0d]">
            <svg
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* gradiente scuro */}
                <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0a0a0a" />
                        <stop offset="100%" stopColor="#111111" />
                    </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#bgGrad)" />

                {/* simboli animati */}
                <text className="anim1" x="10%" y="20%" fill="rgba(220,20,60,0.2)" fontSize="40" fontFamily="monospace">
                    {'{ }'}
                </text>
                <text className="anim2" x="80%" y="25%" fill="rgba(220,20,60,0.15)" fontSize="50" fontFamily="monospace">
                    {'();'}
                </text>
                <text className="anim3" x="25%" y="80%" fill="rgba(220,20,60,0.1)" fontSize="60" fontFamily="monospace">
                    {'<> /'}
                </text>
                <text className="anim4" x="60%" y="60%" fill="rgba(220,20,60,0.18)" fontSize="45" fontFamily="monospace">
                    {'#FF0000'}
                </text>
                <text className="anim5" x="40%" y="40%" fill="rgba(220,20,60,0.12)" fontSize="35" fontFamily="monospace">
                    {'—>'}
                </text>
                <text className="anim6" x="15%" y="50%" fill="rgba(220,20,60,0.14)" fontSize="55" fontFamily="monospace">
                    {'</>'}
                </text>
            </svg>
        </div>
    );
}
