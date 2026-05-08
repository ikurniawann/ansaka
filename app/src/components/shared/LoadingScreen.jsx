export default function LoadingScreen({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ansaka-paper">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-ansaka-gold border-t-transparent" />
        <p className="mt-4 text-sm text-ansaka-muted">{message || 'Memuat...'}</p>
      </div>
    </div>
  );
}
