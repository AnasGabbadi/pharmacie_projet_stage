import {Shield, Truck, Award, Headphones } from 'lucide-react';

function Features () {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Paiement sécurisé",
      description: "Vos transactions sont protégées."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Livraison rapide",
      description: "Recevez vos produits rapidement."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Produits certifiés",
      description: "Qualité et authenticité garanties."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Service client disponible",
      description: "Nous sommes là pour vous aider."
    }
  ];

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eef9e6] rounded-full mb-4 text-[#3E5F44]">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
