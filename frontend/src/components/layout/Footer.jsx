import { Phone, Facebook, Instagram, Cross } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#3E5F44] text-white relative overflow-hidden">
      {/* SVG Background Decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="150" fill="currentColor" opacity="0.3" />
          <circle cx="85%" cy="15%" r="200" fill="currentColor" opacity="0.2" />
          <circle cx="70%" cy="70%" r="180" fill="currentColor" opacity="0.25" />
          <circle cx="15%" cy="85%" r="120" fill="currentColor" opacity="0.3" />
          <path
            d="M 0 300 Q 200 250 400 300 T 800 300 T 1200 300 T 1600 300 V 600 H 0 Z"
            fill="currentColor"
            opacity="0.1"
          />
          <g opacity="0.15">
            <path d="M 150 100 L 150 140 L 130 140 L 130 160 L 150 160 L 150 200 L 170 200 L 170 160 L 190 160 L 190 140 L 170 140 L 170 100 Z" fill="currentColor"/>
            <path d="M 450 400 L 450 440 L 430 440 L 430 460 L 450 460 L 450 500 L 470 500 L 470 460 L 490 460 L 490 440 L 470 440 L 470 400 Z" fill="currentColor"/>
            <path d="M 850 150 L 850 190 L 830 190 L 830 210 L 850 210 L 850 250 L 870 250 L 870 210 L 890 210 L 890 190 L 870 190 L 870 150 Z" fill="currentColor"/>
            <path d="M 1100 550 L 1100 590 L 1080 590 L 1080 610 L 1100 610 L 1100 650 L 1120 650 L 1120 610 L 1140 610 L 1140 590 L 1120 590 L 1120 550 Z" fill="currentColor"/>
          </g>
          {/* ✅ strokeWidth / fill="none" au lieu de stroke-width */}
          <path
            d="M 0 200 Q 300 180 600 200 T 1200 200 T 1800 200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
          />
          <path
            d="M 0 400 Q 300 380 600 400 T 1200 400 T 1800 400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
          />
        </svg>
      </div>

      {/* Section Service Client */}
      <div className="bg-[#3E5F44] border-b border-[#5E936C] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Phone className="w-5 h-5 text-[#1a1464]" />
            </div>
            <div>
              <span className="font-semibold">SERVICE CLIENT :</span>
              <a
                href="tel:+212632478888"
                className="ml-2 px-4 py-1 border-2 border-white rounded-full hover:bg-white hover:text-[#1a1464] transition-colors"
              >
                +(212) 632 478 888
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Pour toutes questions ou demandes du lundi au vendredi de 9h00 à 16h00
          </p>
        </div>
      </div>

      {/* Section Email */}
      <div className="border-b border-[#5E936C] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <span className="text-sm">MAIL : </span>
          <a href="mailto:info@paravital.ma" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            info@paravital.ma
          </a>
        </div>
      </div>

      {/* Colonnes principales */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Colonne 1 - Nos Produits */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase">Nos Produits</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/promotions" className="hover:text-cyan-400 transition-colors">Promotions</a></li>
              <li><a href="/nouveaux-produits" className="hover:text-cyan-400 transition-colors">Nouveaux produits</a></li>
              <li><a href="/meilleures-ventes" className="hover:text-cyan-400 transition-colors">Meilleures ventes</a></li>
            </ul>
          </div>

          {/* Colonne 2 - Infos Pratiques */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase">Infos Pratiques</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/livraison" className="hover:text-cyan-400 transition-colors">Livraison</a></li>
              <li><a href="/mentions-legales" className="hover:text-cyan-400 transition-colors">Mentions légales</a></li>
              <li><a href="/conditions" className="hover:text-cyan-400 transition-colors">Conditions d'utilisation</a></li>
              <li><a href="/qui-sommes-nous" className="hover:text-cyan-400 transition-colors">Qui sommes nous ?</a></li>
              <li><a href="/paiement" className="hover:text-cyan-400 transition-colors">Paiement sécurisé</a></li>
              <li><a href="/conditions-utilisation" className="hover:text-cyan-400 transition-colors" dir="rtl">شروط الإستخدام</a></li>
            </ul>
          </div>

          {/* Colonne 3 - Nous Connaître */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase">Nous Connaître</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contactez-nous</a></li>
            </ul>
          </div>

          {/* Colonne 4 - Votre Compte */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase">Votre Compte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/account/info" className="hover:text-cyan-400 transition-colors">Informations personnelles</a></li>
              <li><a href="/account/orders" className="hover:text-cyan-400 transition-colors">Commandes</a></li>
              <li><a href="/account/credits" className="hover:text-cyan-400 transition-colors">Avoirs</a></li>
              <li><a href="/account/addresses" className="hover:text-cyan-400 transition-colors">Adresses</a></li>
              <li><a href="/account/vouchers" className="hover:text-cyan-400 transition-colors">Bons de réduction</a></li>
            </ul>
          </div>

          {/* Colonne 5 - Réseaux Sociaux */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#93DA97] to-[#93DA97] rounded-2xl p-6 text-center relative overflow-hidden">
              {/* ✅ SVG mini background — attributs camelCase */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20%" cy="30%" r="40" fill="white" />
                  <circle cx="80%" cy="70%" r="50" fill="white" />
                  <path d="M 10 10 L 30 30 M 30 10 L 10 30" stroke="white" strokeWidth="4" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    {/* ✅ Remplacement du SVG inline par le composant Lucide Cross */}
                    <Cross className="w-6 h-6" />
                    <span className="font-bold text-lg">ParaVital</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm mb-4 uppercase">Nous Suivre</h3>

                <div className="flex justify-center gap-3">
                  <a
                    href="https://facebook.com/paravital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3E5F44] hover:bg-[#5E936C] hover:scale-110 rounded-full p-3 transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com/paravital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3E5F44] hover:bg-[#5E936C] hover:scale-110 rounded-full p-3 transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Copyright et Paiements */}
      <div className="border-t border-[#5E936C] bg-[#3E5F44] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-300">
              <p>COPYRIGHT © 2026 - paravital.ma - TOUS LES DROITS RÉSERVÉS</p>
              <p className="text-xs mt-1">
                Édité par : <span className="text-cyan-400">Africa Internet Holding</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">MODE DE PAIEMENT</span>
              <div className="flex gap-2">
                <div className="bg-white rounded px-3 py-1 flex items-center">
                  <span className="text-red-600 font-bold text-xs">CMI</span>
                </div>
                <div className="bg-white rounded px-3 py-1 flex items-center">
                  <span className="text-orange-500 font-bold text-xs">💳</span>
                </div>
                <div className="bg-white rounded px-3 py-1 flex items-center">
                  <span className="text-blue-700 font-bold text-xs">VISA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;