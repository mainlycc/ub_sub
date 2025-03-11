"use client"

import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  const features = [
    {
      icon: "🛡️",
      title: "Ubezpieczenia",
      description: "Kompleksowa obsługa ubezpieczeniowa dla firm i osób prywatnych, w tym OC i CASCO",
      color: "text-blue-900",
      bgColor: "bg-blue-100"
    },
    {
      icon: "💼",
      title: "Leasing",
      description: "Rozwiązania leasingowe dostosowane do potrzeb małych i średnich firm",
      color: "text-red-900",
      bgColor: "bg-red-100"
    },
    {
      icon: "📊",
      title: "Księgowość",
      description: "Profesjonalna obsługa księgowa dla jednoosobowych działalności gospodarczych",
      color: "text-green-900",
      bgColor: "bg-green-100"
    },
    {
      icon: "🤝",
      title: "Doradztwo",
      description: "Indywidualne podejście i eksperckie doradztwo w zarządzaniu ryzykiem",
      color: "text-blue-900",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">O nas</h2>
          <p className="text-xl text-gray-600">Business Care - Twój partner w biznesie</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-blue-800">
              Kompleksowe rozwiązania dla Twojego biznesu
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Business Care to kompleksowy partner w zakresie obsługi ubezpieczeniowej,
              leasingowej oraz doradztwa. Dzięki wieloletniemu doświadczeniu oraz
              indywidualnemu podejściu do każdego klienta, oferujemy szeroki wachlarz
              usług, które pomagają w zarządzaniu ryzykiem oraz zapewniają
              bezpieczeństwo finansowe.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Wieloletnie doświadczenie
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Profesjonalne podejście
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className={`border-none shadow-sm hover:shadow-md transition-shadow ${feature.bgColor} bg-opacity-20`}>
                    <CardContent className="p-4">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className={`font-semibold ${feature.color} mb-1`}>{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg"
          >
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Bezpieczeństwo</h3>
            <p className="text-gray-600">
              Zapewniamy kompleksową ochronę i bezpieczeństwo finansowe Twojej firmy
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg"
          >
            <div className="text-red-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">Rozwój</h3>
            <p className="text-gray-600">
              Wspieramy rozwój Twojego biznesu poprzez elastyczne rozwiązania finansowe
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg"
          >
            <div className="text-green-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">Wsparcie</h3>
            <p className="text-gray-600">
              Zapewniamy profesjonalne wsparcie i indywidualne podejście do każdego klienta
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-blue-900 font-medium">
            Zaufaj ekspertom i zadbaj o bezpieczeństwo swojego biznesu z pomocą Business Care!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs; 