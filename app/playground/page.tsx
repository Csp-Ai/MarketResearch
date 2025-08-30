import samples from '@/data/playground/samples.json';
import BeforeAfter from '@/components/playground/BeforeAfter';
import LocalDetectorsPane from '@/components/playground/LocalDetectorsPane';
import '@/styles/playground.css';

export default function PlaygroundPage() {
  return (
    <section className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redaction Playground</h1>
      <LocalDetectorsPane />
      <BeforeAfter samples={samples.samples} />
    </section>
  );
}
