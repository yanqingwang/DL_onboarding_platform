import { useTranslation } from 'react-i18next';
import { changeLanguage, supportedLanguages } from '../i18n';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeLanguage(event.target.value);
    };

    return (
        <div className="language-switcher">
            <label htmlFor="language-select">{t('language.select')}:</label>
            <select
                id="language-select"
                value={i18n.language}
                onChange={handleLanguageChange}
            >
                {supportedLanguages.map((lang: { code: string; nativeName: string }) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
