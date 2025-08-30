'use client';
import { useState } from 'react';

export default function LeadsPage() {
  const [submitted, setSubmitted] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = {
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      size: (form.elements.namedItem('size') as HTMLInputElement).value,
      vertical: (form.elements.namedItem('vertical') as HTMLInputElement).value,
    };
    await fetch('/api/leads2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_LEADS_API_KEY || '',
      },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  if (submitted) return <p>Thanks!</p>;

  return (
    <form onSubmit={submit} className="p-8 space-y-2">
      <input name="email" placeholder="Work email" className="border p-2" />
      <input name="company" placeholder="Company" className="border p-2" />
      <input name="size" placeholder="Company size" className="border p-2" />
      <input name="vertical" placeholder="Industry vertical" className="border p-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
