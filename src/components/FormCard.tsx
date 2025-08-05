'use client';

type Props = {
  title: string;
  description: string;
  baseUrl: string;
  lineId?: string;
};

export default function FormCard({ title, description, baseUrl, lineId }: Props) {
  const fullUrl = lineId ? `${baseUrl}?ID[0]=${encodeURIComponent(lineId)}` : baseUrl;

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="mb-4 text-gray-700">{description}</p>
      <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        フォームを開く
      </a>
    </div>
  );
}
