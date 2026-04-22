import { useState, useRef, useEffect } from "react";
import { Product, Category } from "@/types/menu.types";
import { Input } from "@/components/ui/Input";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  ImageIcon,
  LinkIcon,
  Sparkles,
  Loader2,
  Pencil,
  Camera,
  Trash2,
  Check,
  Save,
  Plus,
} from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCategoryStore } from "@/store/category/category.slice";
import { translateText } from "@/services/translation.service";
import { formatPriceARS } from "@/lib/formatters";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const { t, lang } = useLangStore();
  const { categories, addCategory } = useCategoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(() =>
    initialData?.price ? initialData.price.toLocaleString("es-AR") : "",
  );

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : "1"),
    name: initialData?.name || { en: "", es: "" },
    price: initialData?.price || 0,
    image: initialData?.image || "",
    isPopular: initialData?.isPopular || false,
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

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Main 2-column grid: Left = text fields, Right = image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Left Column: Name + Price/Category ── */}
          <div className="flex flex-col gap-4">
            {/* Primary language name */}
            <Input
              label={
                <span className="flex items-center gap-2">
                  <span>{primaryLangFlag}</span>
                  Nombre
                  {isTranslatingName && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-yellow-500" />
                  )}
                </span>
              }
              placeholder={lang === "es" ? "Ej: Snack Mix Premium" : "Ex: Snack Mix Premium"}
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
            <div>
              <Input
                label={
                  <span className="flex items-center gap-2">
                    <span>{otherLangFlag}</span>
                    {otherLangLabel}
                    {!wasManuallyEdited && formData.name[otherLang] && !isTranslatingName && (
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

            {/* Price + Category side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-base font-semibold text-slate-500 dark:text-slate-400">
                  Precio en ARS
                </label>
                <div className="flex items-center h-12 rounded-[8px] overflow-hidden border border-transparent bg-slate-50 dark:bg-slate-800/50 focus-within:border-brand-yellow-500 focus-within:bg-white dark:focus-within:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="flex items-center justify-center px-3 h-full text-slate-400 dark:text-slate-500 font-semibold text-[15px] select-none border-r border-slate-200 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-700/30">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={displayPrice}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/[^0-9.,]/g, "");
                      setDisplayPrice(cleanVal);
                      const num = parseFloat(cleanVal.replace(/\./g, "").replace(",", "."));
                      setFormData({ ...formData, price: isNaN(num) ? 0 : num });
                    }}
                    onBlur={() => {
                      if (formData.price > 0) {
                        setDisplayPrice(formatPriceARS(formData.price));
                      } else {
                        setDisplayPrice("");
                      }
                    }}
                    className="flex-1 h-full px-3 bg-transparent text-slate-900 dark:text-white font-medium text-[15px] placeholder:text-slate-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-base font-semibold text-slate-500 dark:text-slate-400">
                  {t("admin.category")}
                </label>

                {categories.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="h-12 w-full px-4 rounded-[8px] border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 text-[14px] font-semibold text-slate-400 dark:text-slate-500 hover:border-brand-yellow-500 hover:text-brand-yellow-600 dark:hover:text-brand-yellow-400 hover:bg-brand-yellow-50/30 dark:hover:bg-brand-yellow-500/5 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Crear categoría
                  </button>
                ) : (
                  <select
                    className="w-full h-12 px-4 rounded-[8px] border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-brand-yellow-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium text-[15px] appearance-none cursor-pointer focus:ring-0 focus-visible:ring-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                    value={formData.categoryId}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setShowCategoryModal(true);
                        e.target.value = formData.categoryId;
                        return;
                      }
                      setFormData({ ...formData, categoryId: e.target.value });
                    }}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                        {cat.name[lang] || cat.name.es}
                      </option>
                    ))}
                    <option disabled className="dark:bg-slate-900">
                      ───────────────
                    </option>
                    <option value="__new__" className="dark:bg-slate-900">
                      + Nueva categoría
                    </option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column: Image ── */}
          <div className="flex flex-col gap-2">
            <label className="pl-1 text-base font-semibold text-slate-500 dark:text-slate-400">
              Imagen
            </label>
            <p className="pl-1 text-[13px] text-slate-400 dark:text-slate-500 leading-snug">
              Agregá una foto de tu producto
            </p>

            {/* Image preview or upload zone */}
            {formData.image ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Image preview */}
                <div className="w-full h-36 bg-slate-100 dark:bg-slate-800">
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
                {/* Action bar — always visible, touch-friendly */}
                <div className="flex border-t border-slate-200 dark:border-slate-700 divide-x divide-slate-200 dark:divide-slate-700">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-100/50 dark:hover:bg-blue-500/10 transition-all active:scale-95"
                  >
                    <Camera className="h-4 w-4" />
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: "" });
                      setShowUrlInput(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-500/5 hover:bg-rose-100/50 dark:hover:bg-rose-500/10 transition-all active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 rounded-xl cursor-pointer hover:border-brand-yellow-500 hover:bg-brand-yellow-50/50 dark:hover:bg-brand-yellow-500/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2 group-hover:bg-brand-yellow-100 dark:group-hover:bg-brand-yellow-500/20 transition-colors">
                  <Camera className="h-5 w-5 text-slate-400 group-hover:text-brand-yellow-600 dark:group-hover:text-brand-yellow-400 transition-colors" />
                </div>
                <p className="font-semibold text-sm text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Toca para subir una foto
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  JPG, PNG · Máx 5MB
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

            {/* URL fallback — subtle link */}
            {!formData.image && (
              <div className="pl-1">
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-[14px] font-medium text-brand-yellow-500 hover:text-brand-yellow-600 dark:text-brand-yellow-400 dark:hover:text-brand-yellow-300 transition-colors flex items-center gap-1"
                  >
                    <LinkIcon className="h-[14px] w-[14px]" />
                    ¿Tenés un enlace? Pegá la URL
                  </button>
                ) : (
                  <Input
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.image}
                    className="h-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-brand-yellow-500 focus:bg-white dark:focus:bg-slate-800 rounded-[8px] transition-colors font-medium text-[13px] focus:ring-0 focus-visible:ring-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Actions — always visible ── */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all active:scale-95 outline-none"
          >
            {t("admin.cancel")}
          </button>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 rounded-xl text-sm font-bold bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20 hover:shadow-brand-yellow-500/30 active:scale-[0.97] transition-all flex items-center justify-center gap-2 outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : initialData ? (
                <Save className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4 stroke-3" />
              )}
              {initialData ? t("admin.save_changes") : "Crear Producto"}
            </button>
          </div>
        </div>
      </form>

      {/* ── Stacked Category Mini-Modal ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowCategoryModal(false)}
          />
          {/* Mini modal */}
          <div className="relative z-10 w-[calc(100%-32px)] max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nueva Categoría</h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CategoryForm
              onCancel={() => setShowCategoryModal(false)}
              onSubmit={(data: Omit<Category, "id">) => {
                addCategory(data);
                // Auto-select the newly created category
                setTimeout(() => {
                  const updated = useCategoryStore.getState().categories;
                  const newest = updated[updated.length - 1];
                  if (newest) {
                    setFormData((prev) => ({ ...prev, categoryId: newest.id }));
                  }
                }, 50);
                setShowCategoryModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
