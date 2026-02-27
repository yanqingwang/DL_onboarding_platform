"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = exports.formatDate = exports.supportedLanguages = exports.middleware = exports.t = exports.changeLanguage = void 0;
const i18next_1 = __importDefault(require("i18next"));
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
i18next_1.default.init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
exports.default = i18next_1.default;
const changeLanguage = (lang) => {
    i18next_1.default.changeLanguage(lang);
};
exports.changeLanguage = changeLanguage;
const t = (key, options) => {
    return i18next_1.default.t(key, options);
};
exports.t = t;
const middleware = (req, res, next) => {
    const lang = req.headers['accept-language'] || 'en';
    if (typeof lang === 'string' && ['en', 'ms', 'tl', 'th'].includes(lang)) {
        i18next_1.default.changeLanguage(lang);
    }
    next();
};
exports.middleware = middleware;
exports.supportedLanguages = ['en', 'ms', 'tl', 'th'];
const formatDate = (date, lang) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const localeMap = {
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
exports.formatDate = formatDate;
const formatNumber = (num, lang) => {
    const localeMap = {
        en: 'en-US',
        ms: 'ms-MY',
        tl: 'ph',
        th: 'th-TH',
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US').format(num);
};
exports.formatNumber = formatNumber;
//# sourceMappingURL=index.js.map