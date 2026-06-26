import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CATEGORIES: Record<string, string[]> = {
  Smileys: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","🥲","😋","😛","🤪","🤨","🧐","🤓","😎","🥸","🤗","🤔","🤭","🤫","🤥"],
  Hearts: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","🫶🏻","💟"],
  Hands: ["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👋","🤚","🖐️","✋","🖖","👏","🙌","🫶","👐","🤲","🤝","🙏"],
  Objects: ["📱","💻","⌨️","🖥️","🖨️","🖱️","💾","💿","📷","🎥","📺","☎️","📞","📟","📡","🔋","🔌","💡","🔦","🕯️","📚","📖","✏️","🖊️","📝","📌","📍"],
  Symbols: ["✅","❌","⭐","🌟","✨","⚡","🔥","💯","💢","💥","💫","💦","💨","🎉","🎊","🎁","🏆","🥇","🥈","🥉","🏅","🎯","🎪","🎨","🎭"],
  Nature: ["🌍","🌎","🌏","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","☀️","⭐","☁️","⛅","🌤️","🌥️","🌦️","🌧️","⛈️","🌩️","❄️","☃️","🌈","🌊","🍀","🌳","🌲","🌴","🌵","🌸","🌺","🌻","🌷"],
  Food: ["🍎","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥔","🥕","🌽","🌶️","🥒","🥬","🥦","🧄","🧅","🍄","🍞","🥐","🍕","🍔","🍟"],
};

const EmojiPicker = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return CATEGORIES;
    const all = Object.values(CATEGORIES).flat();
    return { Results: all };
  }, [q]);

  const copy = (e: string) => {
    navigator.clipboard.writeText(e);
    toast.success(`Copied ${e}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Emoji Picker</h1>
        <p className="text-muted-foreground mb-8">Click any emoji to copy it. Search across all categories.</p>

        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="mb-8" />

        <div className="space-y-8">
          {Object.entries(filtered).map(([cat, list]) => (
            <div key={cat}>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">{cat}</h3>
              <div className="flex flex-wrap gap-1">
                {list.map((e, i) => (
                  <button key={`${e}-${i}`} onClick={() => copy(e)} className="w-10 h-10 text-2xl rounded hover:bg-muted transition-colors" aria-label={`Copy ${e}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmojiPicker;
