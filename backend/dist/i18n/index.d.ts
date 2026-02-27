import i18n from 'i18next';
import { Request, Response, NextFunction } from 'express';
export default i18n;
export declare const changeLanguage: (lang: string) => void;
export declare const t: (key: string, options?: Record<string, unknown>) => string;
export declare const middleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const supportedLanguages: string[];
export declare const formatDate: (date: Date | string, lang: string) => string;
export declare const formatNumber: (num: number, lang: string) => string;
//# sourceMappingURL=index.d.ts.map