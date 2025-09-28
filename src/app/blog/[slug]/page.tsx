import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { getPostBySlug } from '@/lib/blog';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { includeDrafts: true });
  if (!post) return { title: 'Artykuł nie znaleziony' };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || undefined,
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-blue-100 text-xl">{post.excerpt}</p>}
        </div>
      </div>

      <article className="prose prose-lg max-w-3xl mx-auto px-4 py-10 bg-white mt-8 rounded-lg shadow">
        {/* Zakładamy, że content to HTML; w przyszłości można dodać markdown */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {post.author && <p className="text-sm text-gray-500">Autor: {post.author}</p>}
      </div>

      <Footer />
    </div>
  );
}
