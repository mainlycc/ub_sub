"use client"

import React, { useCallback, useRef, useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AcceptedFile = File & { previewUrl?: string };

export interface DocumentUploadValue {
  acPolicyFiles: AcceptedFile[];
  registrationCertificateFiles: AcceptedFile[];
  invoiceFiles: AcceptedFile[];
}

interface DocumentUploadProps {
  value: DocumentUploadValue;
  onChange: (value: DocumentUploadValue) => void;
  maxFilesPerGroup?: number;
}

const preventDefaults = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const isAcceptedType = (file: File) => {
  const accepted = [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];
  return accepted.includes(file.type);
};

const toAcceptedFiles = (files: FileList | File[]): AcceptedFile[] => {
  const list = Array.from(files);
  return list
    .filter(isAcceptedType)
    .map((f) => Object.assign(f, { previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined }));
};

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ value, onChange, maxFilesPerGroup = 4 }) => {
  const [dragActiveAC, setDragActiveAC] = useState(false);
  const [dragActiveRC, setDragActiveRC] = useState(false);
  const [dragActiveInvoice, setDragActiveInvoice] = useState(false);

  const inputACRef = useRef<HTMLInputElement | null>(null);
  const inputRCRef = useRef<HTMLInputElement | null>(null);
  const inputInvoiceRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback((group: 'ac' | 'rc' | 'invoice', files: FileList | File[]) => {
    const accepted = toAcceptedFiles(files);
    if (accepted.length === 0) return;
    if (group === 'ac') {
      const next = [...value.acPolicyFiles, ...accepted].slice(0, maxFilesPerGroup);
      onChange({ ...value, acPolicyFiles: next });
    } else if (group === 'rc') {
      const next = [...value.registrationCertificateFiles, ...accepted].slice(0, maxFilesPerGroup);
      onChange({ ...value, registrationCertificateFiles: next });
    } else if (group === 'invoice') {
      const next = [...value.invoiceFiles, ...accepted].slice(0, maxFilesPerGroup);
      onChange({ ...value, invoiceFiles: next });
    }
  }, [maxFilesPerGroup, onChange, value]);

  const removeFile = (group: 'ac' | 'rc' | 'invoice', index: number) => {
    if (group === 'ac') {
      const next = value.acPolicyFiles.filter((_, i) => i !== index);
      onChange({ ...value, acPolicyFiles: next });
    } else if (group === 'rc') {
      const next = value.registrationCertificateFiles.filter((_, i) => i !== index);
      onChange({ ...value, registrationCertificateFiles: next });
    } else if (group === 'invoice') {
      const next = value.invoiceFiles.filter((_, i) => i !== index);
      onChange({ ...value, invoiceFiles: next });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Polisa AC (jpg, png, pdf)</Label>
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActiveAC ? 'border-[#300FE6] bg-[#300FE6]/5' : 'border-gray-300 bg-white'}`}
          onDragEnter={(e) => { preventDefaults(e); setDragActiveAC(true); }}
          onDragOver={(e) => { preventDefaults(e); setDragActiveAC(true); }}
          onDragLeave={(e) => { preventDefaults(e); setDragActiveAC(false); }}
          onDrop={(e) => { preventDefaults(e); setDragActiveAC(false); handleFiles('ac', e.dataTransfer.files); }}
        >
          <p className="mb-3 text-sm text-gray-600">Przeciągnij i upuść pliki tutaj</p>
          <Button type="button" variant="outline" onClick={() => inputACRef.current?.click()}>
            Wybierz z urządzenia
          </Button>
          <Input
            ref={inputACRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles('ac', e.target.files)}
          />
        </div>
        {value.acPolicyFiles.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {value.acPolicyFiles.map((file, idx) => (
              <li key={`ac-${idx}`} className="flex items-center justify-between rounded border p-2">
                <div className="flex items-center gap-3">
                  {file.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.previewUrl} alt={file.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <span className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs">PDF</span>
                  )}
                  <div>
                    <p className="text-sm font-medium line-clamp-1" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={() => removeFile('ac', idx)}>Usuń</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Dowód rejestracyjny (jpg, png, pdf)</Label>
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActiveRC ? 'border-[#300FE6] bg-[#300FE6]/5' : 'border-gray-300 bg-white'}`}
          onDragEnter={(e) => { preventDefaults(e); setDragActiveRC(true); }}
          onDragOver={(e) => { preventDefaults(e); setDragActiveRC(true); }}
          onDragLeave={(e) => { preventDefaults(e); setDragActiveRC(false); }}
          onDrop={(e) => { preventDefaults(e); setDragActiveRC(false); handleFiles('rc', e.dataTransfer.files); }}
        >
          <p className="mb-3 text-sm text-gray-600">Przeciągnij i upuść pliki tutaj</p>
          <Button type="button" variant="outline" onClick={() => inputRCRef.current?.click()}>
            Wybierz z urządzenia
          </Button>
          <Input
            ref={inputRCRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles('rc', e.target.files)}
          />
        </div>
        {value.registrationCertificateFiles.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {value.registrationCertificateFiles.map((file, idx) => (
              <li key={`rc-${idx}`} className="flex items-center justify-between rounded border p-2">
                <div className="flex items-center gap-3">
                  {file.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.previewUrl} alt={file.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <span className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs">PDF</span>
                  )}
                  <div>
                    <p className="text-sm font-medium line-clamp-1" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={() => removeFile('rc', idx)}>Usuń</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Faktura (jpg, png, pdf)</Label>
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActiveInvoice ? 'border-[#300FE6] bg-[#300FE6]/5' : 'border-gray-300 bg-white'}`}
          onDragEnter={(e) => { preventDefaults(e); setDragActiveInvoice(true); }}
          onDragOver={(e) => { preventDefaults(e); setDragActiveInvoice(true); }}
          onDragLeave={(e) => { preventDefaults(e); setDragActiveInvoice(false); }}
          onDrop={(e) => { preventDefaults(e); setDragActiveInvoice(false); handleFiles('invoice', e.dataTransfer.files); }}
        >
          <p className="mb-3 text-sm text-gray-600">Przeciągnij i upuść pliki tutaj</p>
          <Button type="button" variant="outline" onClick={() => inputInvoiceRef.current?.click()}>
            Wybierz z urządzenia
          </Button>
          <Input
            ref={inputInvoiceRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles('invoice', e.target.files)}
          />
        </div>
        {value.invoiceFiles.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {value.invoiceFiles.map((file, idx) => (
              <li key={`invoice-${idx}`} className="flex items-center justify-between rounded border p-2">
                <div className="flex items-center gap-3">
                  {file.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.previewUrl} alt={file.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <span className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs">PDF</span>
                  )}
                  <div>
                    <p className="text-sm font-medium line-clamp-1" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={() => removeFile('invoice', idx)}>Usuń</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;


