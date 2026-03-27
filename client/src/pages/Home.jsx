import React from 'react';
import { Compass, Camera, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
   return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 flex flex-col justify-center">
         {/* Sleek Minimal Hero */}
         <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 md:w-3/4">
            <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-400">
               <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Global Network Live
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-black dark:text-white leading-[1.1] transition-colors">
               Share Your <br className="hidden md:block" />
               <span className="text-neutral-400 dark:text-neutral-600">Ascent Story.</span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl font-medium text-neutral-500 dark:text-neutral-400 transition-colors">
               The ultimate platform for trekkers. Discover curated routes, track your mountain expeditions, and connect with adventurers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               <Link to="/explore" className="bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-between group">
                  <span>Start Exploring</span>
                  <ArrowRight className="h-5 w-5 ml-4 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link to="/community" className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-2xl font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm text-center">
                  View Community Feed
               </Link>
            </div>
         </div>

         {/* Soft Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 border-t border-neutral-200 dark:border-neutral-900 pt-16 transition-colors">
            {[
               { icon: Compass, title: 'Discover Routes', desc: 'Find curated routes for all difficulty levels globally.' },
               { icon: Navigation, title: 'Connect Locally', desc: 'Meet fellow trekkers and plan joint expeditions.' },
               { icon: MapPin, title: 'Trace Progress', desc: 'Build your stunning portfolio of conquered peaks.' }
            ].map((item, i) => {
               const Icon = item.icon;
               return (
                  <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-neutral-100 dark:border-neutral-900 shadow-sm hover:shadow-xl dark:shadow-none p-8 md:p-10 rounded-3xl hover:-translate-y-1 transition-all group">
                     <div className="h-14 w-14 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-8 border border-neutral-200 dark:border-neutral-800 transition-colors group-hover:rotate-6">
                        <Icon className="h-6 w-6 text-black dark:text-white" strokeWidth={2} />
                     </div>
                     <h3 className="text-xl font-bold text-black dark:text-white mb-3 tracking-tight">{item.title}</h3>
                     <p className="font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">{item.desc}</p>
                  </div>
               )
            })}
         </div>
      </main>
   );
}
