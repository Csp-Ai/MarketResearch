import RuleDesigner from '@/components/policy/RuleDesigner';
import PolicyPreview from '@/components/policy/PolicyPreview';

export default function ConsoleSandboxPage() {
  return (
    <section className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Policy Sandbox 2</h1>
      <RuleDesigner />
      <PolicyPreview />
    </section>
  );
}
