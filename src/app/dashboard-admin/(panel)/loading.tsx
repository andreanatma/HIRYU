export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-6">
      <div className="adm-skeleton h-44 !rounded-xl" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => <div key={i} className="adm-skeleton h-[118px]" />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="adm-skeleton h-72 xl:col-span-2" />
        <div className="adm-skeleton h-72" />
      </div>
    </div>
  );
}
