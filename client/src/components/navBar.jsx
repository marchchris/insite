export default function Navbar() {
    return (
        <nav class="bg-[#2a2a2a]">
            <div class="w-full mx-auto px-8 border-b border-white border-opacity-15 bg-white bg-opacity-5">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <a href="/" className="text-white text-2xl font-bold">In<span className="text-purple-300">Site</span></a>
                    </div>
                    <div class="flex items-center gap-8">
                        <a href="/" class="text-white hover:text-purple-400">Home</a>
                        <a href="/login" class="text-white hover:text-purple-400">Login</a>
                    </div>
                </div>
            </div>
        </nav>
    )
    
}