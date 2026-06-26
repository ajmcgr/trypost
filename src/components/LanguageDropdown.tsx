import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

const STORAGE_KEY = "trypost-language";

const LanguageDropdown = () => {
  const [languageCode, setLanguageCode] = useState("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((language) => language.code === stored)) {
      setLanguageCode(stored);
    }
  }, []);

  const selectedLanguage =
    LANGUAGES.find((language) => language.code === languageCode) ?? LANGUAGES[0];

  const handleSelect = (nextCode: string) => {
    setLanguageCode(nextCode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-3 text-sm">
          <span className="text-base leading-none">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
        {LANGUAGES.map((language) => {
          const isSelected = language.code === selectedLanguage.code;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleSelect(language.code)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-base",
                isSelected && "bg-muted"
              )}
            >
              <Check className={cn("h-5 w-5", isSelected ? "opacity-100" : "opacity-0")} />
              <span className="text-xl leading-none">{language.flag}</span>
              <span>{language.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
