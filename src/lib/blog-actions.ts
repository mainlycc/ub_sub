'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const slug = String(formData.get('slug') || '').trim();
  const excerpt = String(formData.get('excerpt') || '').trim() || null;
  const content = String(formData.get('content') || '').trim();
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null;
  const author = String(formData.get('author') || '').trim() || null;
  const status = String(formData.get('status') || 'DRAFT').toUpperCase();
  const publishedAtRaw = String(formData.get('publishedAt') || '').trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;

  if (!title || !slug || !content) {
    throw new Error('Wymagane: tytuł, slug i treść.');
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      author,
      status,
      publishedAt,
    },
  });

  revalidatePath('/blog');
  if (status === 'PUBLISHED') {
    revalidatePath(`/blog/${slug}`);
  }

  // Zwracamy informację o sukcesie
  return {
    success: true,
    status,
    publishedAt,
    slug,
    title
  };
}
