"use client"

import React, { useCallback, useRef, useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AcceptedFile = File & { previewUrl?: string };

export interface DocumentUploadValue {
  drivingLicenseFiles: AcceptedFile[];
  registrationCertificateFiles: AcceptedFile[];
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
  const [dragActiveDL, setDragActiveDL] = useState(false);
  const [dragActiveRC, setDragActiveRC] = useState(false);

  const inputDLRef = useRef<HTMLInputElement | null>(null);
  const inputRCRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback((group: 'dl' | 'rc', files: FileList | File[]) => {
    const accepted = toAcceptedFiles(files);
    if (accepted.length === 0) return;
    if (group === 'dl') {
      const next = [...value.drivingLicenseFiles, ...accepted].slice(0, maxFilesPerGroup);
      onChange({ ...value, drivingLicenseFiles: next });
    } else {
      const next = [...value.registrationCertificateFiles, ...accepted].slice(0, maxFilesPerGroup);
      onChange({ ...value, registrationCertificateFiles: next });
    }
  }, [maxFilesPerGroup, onChange, value]);

  const removeFile = (group: 'dl' | 'rc', index: number) => {
    if (group === 'dl') {
      const next = value.drivingLicenseFiles.filter((_, i) => i !== index);
      onChange({ ...value, drivingLicenseFiles: next });
    } else {
      const next = value.registrationCertificateFiles.filter((_, i) => i !== index);
      onChange({ ...value, registrationCertificateFiles: next });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Prawo jazdy (jpg, png, pdf)</Label>
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActiveDL ? 'border-[#300FE6] bg-[#300FE6]/5' : 'border-gray-300 bg-white'}`}
          onDragEnter={(e) => { preventDefaults(e); setDragActiveDL(true); }}
          onDragOver={(e) => { preventDefaults(e); setDragActiveDL(true); }}
          onDragLeave={(e) => { preventDefaults(e); setDragActiveDL(false); }}
          onDrop={(e) => { preventDefaults(e); setDragActiveDL(false); handleFiles('dl', e.dataTransfer.files); }}
        >
          <p className="mb-3 text-sm text-gray-600">Przeciągnij i upuść pliki tutaj</p>
          <Button type="button" variant="outline" onClick={() => inputDLRef.current?.click()}>
            Wybierz z urządzenia
          </Button>
          <Input
            ref={inputDLRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles('dl', e.target.files)}
          />
        </div>
        {value.drivingLicenseFiles.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {value.drivingLicenseFiles.map((file, idx) => (
              <li key={`dl-${idx}`} className="flex items-center justify-between rounded border p-2">
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
                <Button type="button" variant="ghost" onClick={() => removeFile('dl', idx)}>Usuń</Button>
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
    </div>
  );
};

export default DocumentUpload;


