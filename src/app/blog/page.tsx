"use client"

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { trackBlogView } from '@/lib/facebook-pixel';

// Przykładowe dane wpisów blogowych
const blogPosts = [
  {
    id: 1,
    title: "Jak nie przepłacać za OC? 5 sposobów na tańsze ubezpieczenie samochodu",
    excerpt: "Ubezpieczenie OC to obowiązkowa polisa dla każdego właściciela pojazdu, ale czy wiesz, że możesz znacząco obniżyć jego koszt? Wielu kierowców co roku przepłaca, nie znając kilku prostych trików.",
    author: "Ekspert BC",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Porady",
    image: "/ub1.jpg",
    slug: "jak-nie-przeplacac-za-oc"
  },
  {
    id: 2,
    title: "Młody kierowca, duża składka? 5 sposobów na obniżenie kosztów ubezpieczenia",
    excerpt: "Jesteś świeżo upieczonym kierowcą i z przerażeniem patrzysz na ceny ubezpieczeń komunikacyjnych? Nie jesteś sam! Młody kierowca to dla ubezpieczyciela synonim wysokiego ryzyka, co przekłada się na wysokie składki OC.",
    author: "Ekspert BC",
    date: "2024-01-12",
    readTime: "7 min",
    category: "Porady",
    image: "/ub3.jpg",
    slug: "mlody-kierowca-duza-skladka"
  },
  {
    id: 3,
    title: "Wypadek, stłuczka, a może kradzież? Kiedy przyda Ci się assistance i NNW",
    excerpt: "Podstawowe ubezpieczenie OC to absolutna konieczność, która chroni nas przed finansowymi konsekwencjami szkód wyrządzonych innym. Ale co, jeśli to Ty potrzebujesz pomocy?",
    author: "Ekspert BC",
    date: "2024-01-10",
    readTime: "6 min",
    category: "Ubezpieczenia",
    image: "/ub2.jpg",
    slug: "wypadek-stluczka-kradziez-assistance-nnw"
  },
  {
    id: 4,
    title: "Ubezpieczenie GAP – czy warto dopłacić, żeby nie stracić tysięcy po szkodzie całkowitej?",
    excerpt: "Kupując nowy samochód, często zastanawiamy się nad ubezpieczeniem AC, które chroni nas przed szkodą całkowitą lub kradzieżą. Ale czy wiesz, że nawet z pełnym autocasco możesz stracić tysiące złotych?",
    author: "Ekspert BC",
    date: "2024-01-08",
    readTime: "9 min",
    category: "GAP",
    image: "/ub4.jpg",
    slug: "ubezpieczenie-gap-czy-warto-doplacic"
  },
  {
    id: 5,
    title: "Kalkulator OC/AC online: Szybko, tanio i bez wychodzenia z domu? Sprawdzamy, jak to działa!",
    excerpt: "W dzisiejszych czasach tempo życia zmusza nas do szukania wygodnych i szybkich rozwiązań. Dotyczy to również ubezpieczeń samochodowych. Czy pamiętasz czasy, gdy porównywanie ofert OC i AC wymagało odwiedzania wielu agencji?",
    author: "Ekspert BC",
    date: "2024-01-06",
    readTime: "7 min",
    category: "Porady",
    image: "/ub5.jpg",
    slug: "kalkulator-oc-ac-online"
  }
];

const BlogPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Śledź wyświetlenie strony blog
    trackBlogView('Blog - Przegląd artykułów');
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog BC
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Ekspercka wiedza o ubezpieczeniach samochodowych, porady i aktualności branżowe
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-[#300FE6] text-[#300FE6] hover:bg-[#300FE6] hover:text-white"
                    onClick={() => post.slug ? router.push(`/blog/${post.slug}`) : router.push('/blog')}
                  >
                    Czytaj więcej
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bądź na bieżąco
            </h2>
            <p className="text-gray-600 mb-6">
              Zapisz się do naszego newslettera i otrzymuj najnowsze artykuły o ubezpieczeniach prosto na swoją skrzynkę.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Twój adres email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6]">
                Zapisz się
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage; 