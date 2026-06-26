import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LANGS: { code: string; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", label: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", label: "中文 (繁體)", flag: "🇹🇼" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "fi", label: "Suomi", flag: "🇫🇮" },
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string) {
  const host = window.location.hostname;
  document.cookie = `${name}=${value};path=/`;
  document.cookie = `${name}=${value};path=/;domain=${host}`;
  if (host.split(".").length >= 2) {
    const root = "." + host.split(".").slice(-2).join(".");
    document.cookie = `${name}=${value};path=/;domain=${root}`;
  }
}

function currentLangCode(): string {
  const c = readCookie("googtrans");
  if (!c) return "en";
  const parts = c.split("/");
  return parts[2] || "en";
}

const LanguageSwitcher = () => {
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    setLang(currentLangCode());
    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGS.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element",
        );
      } catch {}
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const choose = (code: string) => {
    if (code === lang) return;
    if (code === "en") {
      setCookie("googtrans", "");
    } else {
      setCookie("googtrans", `/en/${code}`);
    }
    setLang(code);
    window.location.reload();
  };

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-xs sm:text-sm hover:opacity-80 transition-opacity notranslate">
          <span className="text-lg leading-none">{current.flag}</span>
          <ChevronDown className="w-3 h-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px] max-h-[400px] overflow-y-auto">

          {LANGS.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => choose(l.code)}
              className="gap-2 notranslate"
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LanguageSwitcher;
