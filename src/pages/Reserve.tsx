import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Status = "idle" | "checking" | "available" | "taken" | "invalid" | "reserving" | "reserved" | "error";

const HANDLE_RE = /^[a-zA-Z0-9_]{2,20}$/;

export default function Reserve() {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setIsAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const clean = handle.replace(/^@/, "").trim();

  const check = async () => {
    if (!HANDLE_RE.test(clean)) {
      setStatus("invalid");
      setMessage("Handle must be 2–20 letters, numbers, or underscores.");
      return;
    }
    setStatus("checking");
    const { data, error } = await supabase
      .from("reserved_handles")
      .select("handle")
      .ilike("handle", clean)
      .maybeSingle();
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    if (data) {
      setStatus("taken");
      setMessage(`@${clean} is already reserved.`);
    } else {
      setStatus("available");
      setMessage(`@${clean} is available.`);
    }
  };

  const reserve = async () => {
    if (isAuthed) return;
    setStatus("reserving");
    const { error } = await supabase
      .from("reserved_handles")
      .insert({ handle: clean.toLowerCase() });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("reserved");
    setMessage(`@${clean} is reserved for you. Check your email to claim it.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e85a3c] via-[#e04a2c] to-[#c93a1f] py-20 sm:py-28">
          {/* subtle grid + dots */}
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:80px_80px]" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Reserve your handle
            </h1>
            <p className="mt-4 text-white/90 text-lg max-w-xl mx-auto">
              Lock in your @ before someone else does. Free, one per maker.
            </p>

            <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 bg-black/40 rounded-xl p-2 pl-4">
                <span className="text-white/70 text-xl">@</span>
                <input
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    setStatus("idle");
                    setMessage("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="yourhandle"
                  className="flex-1 bg-transparent text-white text-xl sm:text-2xl placeholder:text-white/40 outline-none py-3"
                />
                <button
                  onClick={check}
                  disabled={!clean || status === "checking"}
                  className="bg-white text-black font-semibold px-5 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-white/90 transition disabled:opacity-50"
                >
                  {status === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Check <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              {status !== "idle" && status !== "checking" && (
                <div className="mt-6 text-left">
                  {isAuthed && (status === "available" || status === "taken") ? (
                    <div className="bg-white rounded-2xl p-5 flex items-start gap-3 shadow-lg">
                      <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-black text-base sm:text-lg">
                        Reservations are for new makers only. Sign out to reserve a handle.
                      </p>
                    </div>
                  ) : (
                    <>
                      {status === "available" && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-300/60 text-emerald-100 font-semibold">
                          <Check className="w-4 h-4" /> Available
                        </span>
                      )}
                      {status === "taken" && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-300/60 text-red-100 font-semibold">
                          <AlertCircle className="w-4 h-4" /> Taken
                        </span>
                      )}
                      {(status === "invalid" || status === "error") && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-300/60 text-yellow-100 font-semibold">
                          <AlertCircle className="w-4 h-4" /> {status === "invalid" ? "Invalid" : "Error"}
                        </span>
                      )}
                      {status === "reserved" && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-300/60 text-emerald-100 font-semibold">
                          <Check className="w-4 h-4" /> Reserved
                        </span>
                      )}

                      <p className="mt-3 text-white text-lg">
                        <span className="font-bold">@{clean}</span>{" "}
                        {status === "available" && "is available."}
                        {status === "taken" && "is already taken."}
                        {status === "reserved" && "is reserved for you."}
                        {(status === "invalid" || status === "error") && message}
                      </p>

                      {status === "available" && !isAuthed && (
                        <button
                          onClick={reserve}
                          className="mt-4 inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-3 rounded-xl hover:bg-white/90 transition shadow-lg"
                        >
                          <Sparkles className="w-4 h-4" /> Reserve @{clean}
                        </button>
                      )}
                      {status === "reserving" && (
                        <p className="mt-3 text-white/80 inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Reserving…</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <p className="mt-6 text-white/80 text-sm">
              <button
                onClick={() => navigator.share?.({ url: window.location.href }).catch(() => {})}
                className="hover:text-white"
              >
                Share via email
              </button>
              <span className="mx-2">·</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just reserved my handle on Post →")}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Post on X
              </a>
            </p>

            {isAuthed && (
              <p className="mt-6 text-white/80 text-sm">
                Already signed in?{" "}
                <Link to="/dashboard" className="underline font-semibold text-white">Go to dashboard</Link>
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
