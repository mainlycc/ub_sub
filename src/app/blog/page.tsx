import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import Footer from '@/components/Footer';
import { listPublishedPosts } from '@/lib/blog';

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await listPublishedPosts({ limit: 30 });

  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog BC</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Ekspercka wiedza o ubezpieczeniach samochodowych, porady i aktualności branżowe
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.slug} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={post.coverUrl ?? '/ub1.jpg'} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Artykuł
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author ?? 'Ekspert BC'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>7 min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt ? post.publishedAt.toISOString() : null)}</span>
                  </div>
                  <Button variant="outline" className="border-[#300FE6] text-[#300FE6] hover:bg-[#300FE6] hover:text-white" asChild>
                    <Link href={`/blog/${post.slug}`}>Czytaj więcej</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bądź na bieżąco</h2>
            <p className="text-gray-600 mb-6">
              Zapisz się do naszego newslettera i otrzymuj najnowsze artykuły o ubezpieczeniach prosto na swoją skrzynkę.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Twój adres email" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent" />
              <Button className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6]">Zapisz się</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 