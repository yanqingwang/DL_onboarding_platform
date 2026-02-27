import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const resources = {
    en: {
        translation: {
            common: {
                appName: 'Blue-Collar Onboarding',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
            },
            auth: {
                loginTitle: 'Login to your account',
                email: 'Email',
                password: 'Password',
            },
        },
    },
    ms: {
        translation: {
            common: {
                appName: 'Perekrutan Buruh',
                loading: 'Memuatkan...',
                error: 'Ralat',
                success: 'Berjaya',
            },
            auth: {
                loginTitle: 'Log masuk ke akaun anda',
                email: 'E-mel',
                password: 'Kata Laluan',
            },
        },
    },
    tl: {
        translation: {
            common: {
                appName: 'Pagre-recruit sa Blue-Collar',
                loading: 'Naglo-load...',
                error: 'Error',
                success: 'Matagumpay',
            },
            auth: {
                loginTitle: 'Mag-login sa iyong account',
                email: 'Email',
                password: 'Password',
            },
        },
    },
    th: {
        translation: {
            common: {
                appName: 'การสรรหาบุคลากรแรงงาน',
                loading: 'กำลังโหลด...',
                error: 'ข้อผิดพลาด',
                success: 'สำเร็จ',
            },
            auth: {
                loginTitle: 'เข้าสู่ระบบ',
                email: 'อีเมล',
                password: 'รหัสผ่าน',
            },
        },
    },
};

i18n.use(Backend).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    preload: ['en', 'ms', 'tl', 'th'],
    backend: {
        loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

export const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
};

export const t = (key: string, options?: object) => {
    return i18n.t(key, options);
};

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const lang = req.headers['accept-language'] || 'en';
    if (typeof lang === 'string' && ['en', 'ms', 'tl', 'th'].includes(lang)) {
        i18n.changeLanguage(lang);
    }
    next();
};

export const supportedLanguages = ['en', 'ms', 'tl', 'th'];

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
