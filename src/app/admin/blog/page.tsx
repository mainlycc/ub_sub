import Link from "next/link";
import { listPublishedPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePostDialog } from "@/components/admin/DeletePostDialog";

export const revalidate = 30;

export default async function AdminBlogPage() {
  const posts = await listPublishedPosts({ limit: 100, offset: 0 });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blog – wpisy</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Nowy wpis</Link>
        </Button>
      </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Lista wpisów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-3">Tytuł</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Data publikacji</th>
                    <th className="p-3">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.slug} className="border-b hover:bg-gray-50">
                      <td className="p-3">{p.title}</td>
                      <td className="p-3">{p.slug}</td>
                      <td className="p-3">{p.status}</td>
                      <td className="p-3">{p.publishedAt ? new Date(p.publishedAt).toLocaleString('pl-PL') : '-'}</td>
                      <td className="p-3">
                        <DeletePostDialog 
                          postId={p.id} 
                          postTitle={p.title}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
