import { Sun, Flower2, Pill, Heart, Syringe, Sparkles } from 'lucide-react';

function CategoriesSection() {
const categories = [
    { icon: <Sun className="w-10 h-10" />, name: "Soins Visage" },
    { icon: <Flower2 className="w-10 h-10" />, name: "Corps & Hygiène" },
    { icon: <Pill className="w-10 h-10" />, name: "Compléments" },
    { icon: <Heart className="w-10 h-10" />, name: "Maternité & Bébé" },
    { icon: <Syringe className="w-10 h-10" />, name: "Premiers Soins" },
    { icon: <Sparkles className="w-10 h-10" />, name: "Bien-être" }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explorer nos catégories
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#eef9e6] rounded-full mb-4 text-[#3E5F44]">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;