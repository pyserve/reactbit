import Header from "@/components/nav-header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="mt-4 text-muted-foreground">
          You've successfully logged in!
        </p>
      </div>
    </div>
  );
}
