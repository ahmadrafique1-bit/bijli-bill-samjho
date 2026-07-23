import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { explainBill } from "@/lib/explain-bill.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bijli Bill Samjho — Pakistani bills, asaan Urdu mein" },
      {
        name: "description",
        content:
          "Apna bijli ka bill upload karein aur asaan Roman Urdu mein AI se samjhein. IESCO, LESCO, K-Electric aur baaqi companies ke bills support.",
      },
      { property: "og:title", content: "Bijli Bill Samjho" },
      {
        property: "og:description",
        content: "Pakistani electricity bills, asaan Roman Urdu mein samjhein.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MAX_SIZE = 5 * 1024 * 1024;
const LOADING_MESSAGES = [
  "Bill parha ja raha hai...",
  "Charges samjhe ja rahe hain...",
  "Slab check ho rahi hai...",
  "Jawab tayyar ho raha hai...",
];

function LightningIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />
    </svg>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoadingIdx((i) => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = useCallback((f: File | null | undefined) => {
    setError(null);
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Sirf JPG, PNG ya WEBP image upload karein.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image bohat bari hai (5MB se kam honi chahiye).");
      return;
    }
    setFile(f);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
  }, []);

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      const res = await explainBill({ data: { imageBase64: base64, mimeType: file.type } });
      setResult(res.text);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Kuch masla ho gaya, dobara koshish karein.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <header className="mx-auto max-w-3xl px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary text-sm font-medium">
          <LightningIcon className="w-4 h-4" />
          Bijli Bill Samjho
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Apna bijli ka bill{" "}
          <span className="text-primary">asaan Urdu</span> mein samjhein
        </h1>
        <p className="mt-3 text-muted-foreground text-base">
          Bill ki photo upload karein — AI aap ko har charge, slab, aur bachat ke tareeqe batayega.
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12">
        {!result && (
          <section
            className={`rounded-2xl border-2 border-dashed bg-card p-6 sm:p-10 shadow-sm transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            {!previewUrl ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LightningIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium">Bill ki photo yahan drag karein</p>
                <p className="text-sm text-muted-foreground mt-1">ya neeche button dabayein · JPG, PNG, WEBP · max 5MB</p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Photo Upload Karein
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Bill preview"
                  className="max-h-80 rounded-lg border border-border shadow-sm"
                />
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
                  >
                    Photo Badlein
                  </button>
                  <button
                    onClick={reset}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
                  >
                    Remove
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            {previewUrl && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                      {LOADING_MESSAGES[loadingIdx]}
                    </>
                  ) : (
                    <>
                      <LightningIcon className="w-5 h-5" />
                      Bill Samjhao
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {result && (
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LightningIcon className="w-5 h-5 text-primary" />
                Aap Ka Bill Explained
              </h2>
              {previewUrl && (
                <img src={previewUrl} alt="Bill" className="w-14 h-14 object-cover rounded-md border border-border" />
              )}
            </div>
            <div className="prose-urdu">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                <LightningIcon className="w-4 h-4" />
                Naya Bill Check Karein
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground">
        Bijli Bill Samjho — Pakistani bills, asaan Urdu mein
      </footer>
    </div>
  );
}
