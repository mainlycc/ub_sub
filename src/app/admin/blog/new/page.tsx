'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPost } from '@/lib/blog-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, CheckCircle, Clock } from 'lucide-react';

// Funkcja renderująca tooltip (identyczna jak w InsuranceCalculator)
const renderTooltip = (text: string) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-1 inline-flex cursor-help text-gray-400 hover:text-gray-600">
          <Info size={16} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function NewPostPage() {
  const [successMessage, setSuccessMessage] = useState<{
    type: 'published' | 'scheduled' | 'draft';
    title: string;
    slug: string;
    publishedAt?: Date;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createPost(formData);
      if (result.success) {
        setSuccessMessage({
          type: result.status === 'PUBLISHED' 
            ? (result.publishedAt && new Date(result.publishedAt) > new Date() ? 'scheduled' : 'published')
            : 'draft',
          title: result.title,
          slug: result.slug,
          publishedAt: result.publishedAt
        });
        
        // Wyczyść formularz
        const form = document.getElementById('post-form') as HTMLFormElement;
        if (form) form.reset();
      }
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Nowy wpis</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/blog">Powrót</Link>
        </Button>
      </div>

        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            {successMessage.type === 'published' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Wpis został opublikowany!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Artykuł &quot;{successMessage.title}&quot; jest już dostępny na blogu. 
                  <Link href={`/blog/${successMessage.slug}`} className="underline ml-1">
                    Zobacz artykuł
                  </Link>
                </AlertDescription>
              </>
            )}
            {successMessage.type === 'scheduled' && (
              <>
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Wpis został zaplanowany!</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Artykuł &quot;{successMessage.title}&quot; zostanie opublikowany {successMessage.publishedAt && new Date(successMessage.publishedAt).toLocaleString('pl-PL')}.
                </AlertDescription>
              </>
            )}
            {successMessage.type === 'draft' && (
              <>
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <AlertTitle className="text-gray-800">Wpis został zapisany jako draft!</AlertTitle>
                <AlertDescription className="text-gray-700">
                  Artykuł &quot;{successMessage.title}&quot; został zapisany i będzie widoczny tylko w panelu admina.
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Tworzenie nowego wpisu</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="post-form" action={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Tytuł
                  {renderTooltip("Główny tytuł artykułu, który będzie wyświetlany na stronie bloga")}
                </Label>
                <Input id="title" name="title" placeholder="Tytuł wpisu" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">
                  Slug
                  {renderTooltip("Adres URL artykułu (np. pierwszy-wpis). Używaj małych liter, myślników zamiast spacji")}
                </Label>
                <Input id="slug" name="slug" placeholder="np. pierwszy-wpis" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="excerpt">
                  Lead / opis
                  {renderTooltip("Krótki opis artykułu, który będzie wyświetlany na liście bloga i w meta tagach")}
                </Label>
                <Textarea id="excerpt" name="excerpt" placeholder="Krótki opis" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">
                  Treść (HTML lub Markdown)
                  {renderTooltip("Główna treść artykułu. Musisz używać specjalnych znaczników: <p>tekst</p> dla akapitów, <h2>nagłówek</h2> dla tytułów, <strong>pogrubiony</strong> dla wyróżnień. Przykład: <p>Pierwszy akapit.</p><h2>Nagłówek sekcji</h2><p>Drugi akapit z <strong>pogrubionym tekstem</strong>.</p>")}
                </Label>
                <Textarea id="content" name="content" placeholder="<p>Treść...</p>" className="min-h-60" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coverUrl">
                  Okładka (URL)
                  {renderTooltip("Link do obrazka okładki artykułu. Może być z internetu lub ścieżka do pliku w public/")}
                </Label>
                <Input id="coverUrl" name="coverUrl" placeholder="https://..." />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="author">
                  Autor
                  {renderTooltip("Imię i nazwisko autora artykułu (np. Ekspert BC, Jan Kowalski)")}
                </Label>
                <Input id="author" name="author" placeholder="np. Ekspert BC" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">
                    Status
                    {renderTooltip("DRAFT - zapisany, ale niewidoczny publicznie. PUBLISHED - opublikowany i widoczny na blogu")}
                  </Label>
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="DRAFT"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="publishedAt">
                    Data publikacji (opcjonalnie)
                    {renderTooltip("Ustaw przyszłą datę, aby zaplanować publikację. Jeśli puste, używa się aktualnej daty")}
                  </Label>
                  <Input id="publishedAt" name="publishedAt" type="datetime-local" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" name="submitType" value="draft">Zapisz jako draft</Button>
                <Button 
                  type="submit" 
                  name="submitType" 
                  value="publish" 
                  className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] text-white"
                >
                  Opublikuj
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
