import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blite-black p-4 pt-28">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-blite-surface border border-blite-border shadow-xl",
            }
          }}
        />
      </div>
    </div>
  );
}