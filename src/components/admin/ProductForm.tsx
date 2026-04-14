import { useState, useRef, useEffect } from "react";
import { Product } from "@/types/menu.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Save,
  X,
  ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  Globe,
  Settings2,
  Pencil,
} from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCategoryStore } from "@/store/category/category.slice";
import { translateText } from "@/services/translation.service";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isManualMode: boolean;
  setIsManualMode: (val: boolean) => void;
}

export const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isManualMode,
  setIsManualMode,
}: ProductFormProps) => {
  const { t, lang } = useLangStore();
  const { categories } = useCategoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    categoryId:
      initialData?.categoryId ||
      (categories.length > 0 ? categories[0].id : "1"),
    name: initialData?.name || { en: "", es: "" },
    description: initialData?.description || { en: "", es: "" },
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    image: initialData?.image || "",
    isPopular: initialData?.isPopular || false,
  });

  // Smart Name Sync: Bidirectional
  useEffect(() => {
    if (isManualMode) return;
    const activeText = formData.name[lang];
    if (!activeText || activeText.length < 2) return;

    const timer = setTimeout(async () => {
      setIsTranslatingName(true);
      const result = await translateText(activeText, "en", "product");
      const { translatedText, detectedLang } = result;

      if (detectedLang.startsWith("es")) {
        setFormData((prev) => ({
          ...prev,
          name: { es: activeText, en: translatedText },
        }));
      } else if (detectedLang.startsWith("en")) {
        const esResult = await translateText(activeText, "es", "product");
        setFormData((prev) => ({
          ...prev,
          name: { en: activeText, es: esResult.translatedText },
        }));
      }
      setIsTranslatingName(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.name[lang], lang]);

  // Smart Description Sync: Bidirectional
  useEffect(() => {
    if (isManualMode) return;
    const activeText = formData.description[lang];
    if (!activeText || activeText.length < 5) return;

    const timer = setTimeout(async () => {
      setIsTranslatingDesc(true);
      const result = await translateText(activeText, "en", "description");
      const { translatedText, detectedLang } = result;

      if (detectedLang.startsWith("es")) {
        setFormData((prev) => ({
          ...prev,
          description: { es: activeText, en: translatedText },
        }));
      } else if (detectedLang.startsWith("en")) {
        const esResult = await translateText(activeText, "es", "description");
        setFormData((prev) => ({
          ...prev,
          description: { en: activeText, es: esResult.translatedText },
        }));
      }
      setIsTranslatingDesc(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData.description[lang], lang]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const otherLang = lang === "es" ? "en" : "es";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t("admin.name")}
            {isTranslatingName && (
              <Loader2 className="h-4 w-4 animate-spin text-brand-yellow-500" />
            )}
          </label>
          <div className="relative">
            <Input
              placeholder={
                lang === "es"
                  ? "Ej: Snack Mix Premium"
                  : "Ex: Snack Mix Premium"
              }
              value={formData.name[lang]}
              className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-lg"
              onChange={(e) => {
                const val = e.target.value;
                const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                setFormData({
                  ...formData,
                  name: { ...formData.name, [lang]: capitalized },
                });
              }}
              required
            />
            {!isManualMode &&
              formData.name[otherLang] &&
              !isTranslatingName && (
                <button
                  type="button"
                  onClick={() => setIsManualMode(true)}
                  className="absolute -bottom-6 left-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 hover:text-brand-yellow-600 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto:{" "}
                  <span className="text-brand-yellow-600 dark:text-brand-yellow-400">
                    {formData.name[otherLang]}
                  </span>
                  <Pencil className="h-2.5 w-2.5 ml-1" />
                </button>
              )}
          </div>

          {isManualMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Input
                placeholder={`Nombre en ${otherLang === "es" ? "Español" : "Inglés"}`}
                value={formData.name[otherLang]}
                className="h-12 bg-white dark:bg-slate-900 border-brand-yellow-100 dark:border-brand-yellow-900/30 rounded-xl text-sm font-bold border-2"
                onChange={(e) => {
                  const val = e.target.value;
                  const capitalized =
                    val.charAt(0).toUpperCase() + val.slice(1);
                  setFormData({
                    ...formData,
                    name: { ...formData.name, [otherLang]: capitalized },
                  });
                }}
                required
              />
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t("admin.category")}
          </label>
          <select
            className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-brand-yellow-500 outline-none transition-all font-bold appearance-none cursor-pointer"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                {cat.name[lang] || cat.name.es}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price & Stock Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t("admin.price")}
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl font-bold"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t("admin.stock")}
          </label>
          <Input
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value) })
            }
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl font-bold"
            required
          />
        </div>
      </div>

      {/* Dual Image Selection */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t("admin.image_source")}
          </label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                imageMode === "url"
                  ? "bg-white dark:bg-slate-700 text-brand-yellow-600 dark:text-brand-yellow-400 shadow-sm"
                  : "text-slate-400",
              )}
            >
              <LinkIcon className="h-4 w-4" /> {t("admin.url_image")}
            </button>
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                imageMode === "upload"
                  ? "bg-white dark:bg-slate-700 text-brand-yellow-600 dark:text-brand-yellow-400 shadow-sm"
                  : "text-slate-400",
              )}
            >
              <Upload className="h-4 w-4" /> {t("admin.upload_image")}
            </button>
          </div>
        </div>

        {imageMode === "url" ? (
          <Input
            placeholder={
              lang === "es"
                ? "https://ejemplo.com/imagen.jpg"
                : "https://example.com/image.jpg"
            }
            value={formData.image}
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            leftIcon={<ImageIcon className="h-5 w-5 text-slate-400" />}
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl cursor-pointer hover:border-brand-yellow-500 transition-all group"
          >
            <Upload className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-brand-yellow-500 mb-4 transition-colors" />
            <p className="font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
              {t("admin.choose_file")}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {formData.image && (
          <div className="relative h-48 w-48 mx-auto md:mx-0 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl">
            <img
              src={formData.image}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image: "" })}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 font-black py-4 sm:py-6 rounded-2xl shadow-xl shadow-brand-yellow-500/20 active:scale-95 transition-all text-lg"
          leftIcon={<Save className="h-6 w-6" />}
        >
          {initialData ? t("admin.save_changes") : t("admin.add_product")}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 sm:py-6 rounded-2xl active:scale-95 transition-all text-lg"
          leftIcon={<X className="h-6 w-6" />}
        >
          {t("admin.cancel")}
        </Button>
      </div>
    </form>
  );
};
