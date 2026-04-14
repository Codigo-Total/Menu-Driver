const API_URL = 'https://translate.googleapis.com/translate_a/single';

// Smart Dictionary for restaurant context traps
const SMART_DICTIONARY: Record<string, Record<string, string>> = {
  'es': {
    'auto': 'car',
    'autos': 'cars',
    'papa': 'potato',
    'papas': 'potatoes',
    'combi': 'van',
    'combis': 'vans',
    'volante': 'steering wheel',
    'volantes': 'steering wheels',
  },
  'en': {
    'car': 'auto',
    'cars': 'autos',
    'potato': 'papa',
    'potatoes': 'papas',
    'steering wheel': 'volante',
    'steering wheels': 'volantes',
  }
};

export interface TranslationResult {
  translatedText: string;
  detectedLang: string;
}

export const translateText = async (
  text: string, 
  targetLang: 'en' | 'es',
  context: 'category' | 'product' | 'description' = 'category'
): Promise<TranslationResult> => {
  if (!text || text.trim().length === 0) return { translatedText: '', detectedLang: targetLang };
  
  const cleanText = text.trim().toLowerCase();
  
  // 1. Check Smart Dictionary first
  if (cleanText.split(' ').length <= 2) {
    const sourceLangCode = targetLang === 'en' ? 'es' : 'en';
    const mapping = SMART_DICTIONARY[sourceLangCode]?.[cleanText];
    if (mapping) {
      return { 
        translatedText: targetLang === 'en' ? mapping.charAt(0).toUpperCase() + mapping.slice(1) : mapping,
        detectedLang: sourceLangCode
      };
    }
  }

  const tl = targetLang === 'en' ? 'en' : 'es';

  try {
    // Using Google Translate gtx client with sl=auto for smart detection
    const url = `${API_URL}?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // data[0][0][0] is translation, data[2] is detected language
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      let result = data[0][0][0].trim();
      const detectedLang = data[2] || (targetLang === 'en' ? 'es' : 'en');
      
      // Capitalize first letter
      result = result.charAt(0).toUpperCase() + result.slice(1);
      
      // Auto-fix for specific cases
      if (result.toLowerCase() === cleanText && targetLang === 'en' && cleanText === 'autos') {
        result = 'Cars';
      }
      
      return { translatedText: result, detectedLang };
    }
    
    return { translatedText: text, detectedLang: targetLang };
  } catch (error) {
    console.error('Translation service error (Google):', error);
    return { translatedText: text, detectedLang: targetLang };
  }
};
