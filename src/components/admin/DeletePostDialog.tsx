'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeletePostDialogProps {
  postId: string;
  postTitle: string;
}

export function DeletePostDialog({ postId, postTitle }: DeletePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOpen(false);
        window.location.reload();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert('Sesja wygasła. Zaloguj się ponownie.');
          window.location.href = '/admin/login';
        } else {
          alert(`Błąd: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu:', error);
      alert('Wystąpił błąd podczas usuwania wpisu');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usuń wpis</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć wpis "{postTitle}"? 
            Ta operacja jest nieodwracalna.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Anuluj
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
