export default function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="mb-10 font-mono text-xs tracking-widest text-mut">
      <span className="text-acc">// {n}</span> — {children.toUpperCase()}
    </div>
  );
}
