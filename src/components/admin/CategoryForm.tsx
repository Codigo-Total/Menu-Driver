import { useState, useEffect } from "react";
import { Category } from "@/types/menu.types";
import { Input } from "@/components/ui/Input";
import { Sparkles, Loader2, Pencil } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";
import { translateText } from "@/services/translation.service";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm = ({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) => {
  const { t, lang } = useLangStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);

  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: initialData?.name || { en: "", es: "" },
    icon: initialData?.icon || "Package",
  });

  const otherLang = lang === "es" ? "en" : "es";
  const otherLangLabel = otherLang === "es" ? "Español" : "English";
  const otherLangFlag = otherLang === "es" ? "🇪🇸" : "🇺🇸";
  const primaryLangFlag = lang === "es" ? "🇪🇸" : "🇺🇸";

  // Auto-translate primary → secondary (unless manually edited)
  useEffect(() => {
    if (wasManuallyEdited) return;

    const activeText = formData.name[lang];
    if (!activeText || activeText.length < 2) return;

    const timer = setTimeout(async () => {
      setIsTranslating(true);

      const result = await translateText(activeText, "en", "category");
      const { translatedText, detectedLang } = result;

      if (detectedLang.startsWith("es")) {
        setFormData((prev) => ({
          ...prev,
          name: { es: activeText, en: translatedText },
        }));
      } else if (detectedLang.startsWith("en")) {
        const esResult = await translateText(activeText, "es", "category");
        setFormData((prev) => ({
          ...prev,
          name: { en: activeText, es: esResult.translatedText },
        }));
      }

      setIsTranslating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.name[lang], lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-1">
      <div className="flex flex-col gap-4">
        {/* Primary language */}
        <Input
          label={
            <span className="flex items-center gap-2">
              <span>{primaryLangFlag}</span>
              {t("admin.category_name")}
              {isTranslating && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-yellow-500" />
              )}
            </span>
          }
          placeholder={lang === "es" ? "Ej: Snacks, Bebidas..." : "Ex: Snacks, Drinks..."}
          value={formData.name[lang]}
          className="h-12 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-brand-yellow-500 focus:bg-white dark:focus:bg-slate-800 rounded-[8px] font-medium text-[15px] transition-colors focus:ring-0 focus-visible:ring-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          onChange={(e) => {
            const val = e.target.value;
            const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
            setWasManuallyEdited(false);
            setFormData({
              ...formData,
              name: { ...formData.name, [lang]: capitalized },
            });
          }}
          required
        />

        {/* Secondary language — always visible */}
        <Input
          label={
            <span className="flex items-center gap-2">
              <span>{otherLangFlag}</span>
              {otherLangLabel}
              {!wasManuallyEdited && formData.name[otherLang] && !isTranslating && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-brand-yellow-500">
                  <Sparkles className="h-3 w-3" />
                  auto
                </span>
              )}
              {wasManuallyEdited && formData.name[otherLang] && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Pencil className="h-3 w-3" />
                  editado
                </span>
              )}
            </span>
          }
          placeholder={`Nombre en ${otherLangLabel}`}
          value={formData.name[otherLang]}
          className="h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-brand-yellow-500 focus:bg-white dark:focus:bg-slate-800 rounded-[8px] font-medium text-[14px] transition-colors focus:ring-0 focus-visible:ring-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          onChange={(e) => {
            const val = e.target.value;
            const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
            setWasManuallyEdited(true);
            setFormData({
              ...formData,
              name: { ...formData.name, [otherLang]: capitalized },
            });
          }}
          required
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all active:scale-95 outline-none"
        >
          {t("admin.cancel")}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 rounded-xl text-sm font-bold bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 shadow-md shadow-brand-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 outline-none disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? t("admin.save_changes") : t("admin.add_category")}
        </button>
      </div>
    </form>
  );
};
