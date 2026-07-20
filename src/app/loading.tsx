export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="mt-6 text-lg font-medium text-muted-foreground">
          Loading...
        </p>
      </div>
    </main>
  );
}