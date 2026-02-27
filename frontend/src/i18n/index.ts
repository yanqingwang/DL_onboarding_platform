import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ms from './locales/ms.json';
import tl from './locales/tl.json';
import th from './locales/th.json';

export const resources = {
    en: { translation: en },
    ms: { translation: ms },
    tl: { translation: tl },
    th: { translation: th },
};

export const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
    { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;

export const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
};

export const formatDate = (date: Date | string, lang: string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const localeMap: Record<string, string> = {
        en: 'en-US',
        ms: 'ms-MY',
        tl: 'ph',
        th: 'th-TH',
    };
    return d.toLocaleDateString(localeMap[lang] || 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatNumber = (num: number, lang: string): string => {
    const localeMap: Record<string, string> = {
        en: 'en-US',
        ms: 'ms-MY',
        tl: 'ph',
        th: 'th-TH',
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US').format(num);
};

export const formatCurrency = (amount: number, lang: string, currency: string = 'USD'): string => {
    const localeMap: Record<string, string> = {
        en: 'en-US',
        ms: 'ms-MY',
        tl: 'ph',
        th: 'th-TH',
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
