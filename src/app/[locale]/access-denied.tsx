export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
      <h1 className="text-2xl font-semibold mb-2">403 - Forbidden</h1>
      <p className="text-white/70 max-w-md">
        You don&apos;t have access to this briefing link. If you believe this is a mistake, contact your agency
        contact for an updated link.
      </p>
    </div>
  );
}
