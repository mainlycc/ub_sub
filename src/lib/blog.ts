import prisma from "@/lib/prisma";

export type BlogListOptions = {
  includeDrafts?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  tag?: string;
};

export async function listPublishedPosts(options: BlogListOptions = {}) {
  const { limit = 20, offset = 0, search, tag } = options;
  const now = new Date();

  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: now } },
      ],
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        tag
          ? {
              OR: [
                { tags: { contains: `"${tag}"` } }, // JSON string match fallback
                { tags: { contains: tag } }, // CSV fallback
              ],
            }
          : {},
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    skip: offset,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      author: true,
      coverUrl: true,
      publishedAt: true,
      updatedAt: true,
      status: true,
    },
  });
}

export async function getPostBySlug(slug: string, opts?: { includeDrafts?: boolean }) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return null;

  const now = new Date();
  const isPublished =
    post.status === "PUBLISHED" && (!post.publishedAt || post.publishedAt <= now);

  if (opts?.includeDrafts) return post;
  return isPublished ? post : null;
}
