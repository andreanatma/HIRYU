export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-[#DCE3EC]" />
      <div className="h-64 animate-pulse rounded-lg bg-[#DCE3EC]/70" />
    </div>
  );
}
