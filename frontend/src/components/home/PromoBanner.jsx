import { Heart, Sparkles } from 'lucide-react';

function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5E936C] via-[#3E5F44] to-[#5E936C]">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-green-300 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Colonne gauche - Contenu */}
          <div className="text-white space-y-6">
            {/* Badge/Tag */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              <span>Nos coups de cœur</span>
            </div>

            {/* Titre principal */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                Découvrez nos
              </h2>
              <p className="text-3xl md:text-4xl font-light text-cyan-200">
                produits du mois
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-200 max-w-md">
              Profitez de nos offres exceptionnelles sur une sélection de produits 
              de qualité pour toute la famille.
            </p>

            {/* Floating hearts decoration */}
            <div className="flex gap-4 py-4">
              <div className="animate-pulse">
                <Heart className="w-8 h-8 text-white/40 fill-white/40" />
              </div>
              <div className="animate-pulse delay-75">
                <Heart className="w-10 h-10 text-white/50 fill-white/50" />
              </div>
              <div className="animate-pulse delay-150">
                <Heart className="w-6 h-6 text-white/30 fill-white/30" />
              </div>
            </div>
          </div>

          {/* Colonne droite - Produit en vedette */}
          <div className="relative">
            {/* Card produit */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              {/* Badge promo */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#5E936C] to-emerald-500 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg rotate-12">
                <span className="text-xs font-semibold">-25%</span>
                <span className="text-xl font-bold">OFF</span>
              </div>

              {/* Contenu produit */}
              <div className="space-y-4">
                {/* Nom du produit */}
                <div>
                  <h3 className="text-2xl font-bold text-[#1a1464] mb-1">
                    Crème Hydratante
                  </h3>
                  <p className="text-sm text-gray-600">
                    Soin visage bio pour peaux sensibles 50ml
                  </p>
                </div>

                {/* Image produit placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="text-6xl">💊</div>
                  {/* Formes décoratives */}
                  <div className="absolute top-2 right-2 w-16 h-16 bg-cyan-200/50 rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-2 w-20 h-20 bg-green-200/50 rounded-full blur-xl"></div>
                </div>

                {/* Prix */}
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-[#3E5F44]">
                    60dhs
                  </span>
                  <span className="text-lg text-gray-400 line-through mb-1">
                    80dhs
                  </span>
                </div>

                {/* Bouton CTA */}
                <button className="w-full bg-gradient-to-r from-[#5E936C] to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  J'EN PROFITE
                </button>

                {/* Info stock */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Seulement 12 en stock</span>
                </div>
              </div>
            </div>

            {/* Éléments décoratifs flottants */}
            <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-cyan-300/30 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-green-300/30 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* SVG Wave separator */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default PromoBanner;