import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (!id || isNaN(postId)) {
      return NextResponse.json(
        { error: "Brak ID wpisu lub nieprawidłowy format" },
        { status: 400 }
      );
    }

    // Sprawdź czy wpis istnieje
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, slug: true, status: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Wpis nie został znaleziony" },
        { status: 404 }
      );
    }

    // Usuń wpis
    await prisma.post.delete({
      where: { id: postId }
    });

    // Odśwież cache
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    if (existingPost.status === 'PUBLISHED') {
      revalidatePath(`/blog/${existingPost.slug}`);
    }

    return NextResponse.json(
      { success: true, message: "Wpis został usunięty" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Błąd podczas usuwania wpisu:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas usuwania wpisu" },
      { status: 500 }
    );
  }
}

