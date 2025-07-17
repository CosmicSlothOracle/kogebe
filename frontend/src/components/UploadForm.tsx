import React, { useRef, useState } from 'react';

interface Props {
  onUploaded: (bannerUrl: string) => void;
}

const MAX_SIZE_MB = 5;

const UploadForm: React.FC<Props> = ({ onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Datei zu groß (max. ${MAX_SIZE_MB} MB)`);
      return;
    }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setError('Nur PNG-Dateien erlaubt');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // TODO: Add auth header (Bearer token) for admin
      const res = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok) {
        onUploaded(json.url);
      } else {
        setError(json.error || 'Upload fehlgeschlagen');
      }
    } catch (err) {
      setError('Upload fehlgeschlagen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Banner hochladen (PNG ≤ 5 MB)</label>
      <input
        type="file"
        accept="image/png"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded w-full"
      />
      {uploading && <p className="text-sm mt-2">Lade hoch...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default UploadForm;