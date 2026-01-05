function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-[#93DA97] to-[#E8FFD7] py-16 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prenez soin de vous avec confiance et qualité.
          </h1>
          <p className="text-gray-600 mb-8">
            Découvrez notre sélection de produits de parapharmacie, choisis avec rigueur pour leur qualité et leur authenticité. Votre bien-être est notre priorité.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Découvrir les produits
            </button>
            <button className="px-6 py-3 bg-[#3E5F44] text-white rounded-lg hover:bg-[#5E936C] transition">
              Voir les catégories
            </button>
          </div>
        </div>
        
        <div className="w-80 h-64 bg-[#5E936C] rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-[19rem] h-24 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                className="rounded-[5%]"
                src="/images/heroSectionLogo.jpg"
                alt="Image de l'entreprise"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;