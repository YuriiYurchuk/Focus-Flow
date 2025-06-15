export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto">
      <div className="bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-white/10 shadow-2xl">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>{" "}
            <div className="absolute w-16 h-16 border-3 border-transparent border-t-purple-400 border-l-pink-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:0.8s]"></div>
            <div className="absolute w-8 h-8 border-2 border-transparent border-t-blue-400 rounded-full animate-spin [animation-duration:0.6s]"></div>
            <div className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
          <div className="text-center space-y-3">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Завантаження
              </h1>
              <div className="absolute inset-0 text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent opacity-20 blur-sm">
                Завантаження
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Підготовка вашого контенту...
            </p>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400/40 rounded-full animate-ping [animation-delay:0s]"></div>
            <div className="absolute top-12 right-12 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce [animation-delay:0.5s]"></div>
            <div className="absolute top-20 left-20 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse [animation-delay:1s]"></div>
            <div className="absolute bottom-8 right-8 w-2 h-2 bg-purple-400/40 rounded-full animate-ping [animation-delay:1.5s]"></div>
            <div className="absolute bottom-12 left-12 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce [animation-delay:2s]"></div>
            <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse [animation-delay:2.5s]"></div>
            <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400/50 rounded-full animate-ping [animation-delay:3s]"></div>
            <div className="absolute top-1/3 right-4 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce [animation-delay:3.5s]"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:0s]"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>
    </div>
  );
};
