import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../locale/en.json";
import zhCN from "../locale/zh-cn.json";

export const SUPPORTED_LOCALES = ["en", "zh-cn"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "en";

function matchSupportedLocale(tag: string): SupportedLocale | undefined {
    const normalized = tag.toLowerCase();
    if ((SUPPORTED_LOCALES as readonly string[]).includes(normalized)) {
        return normalized as SupportedLocale;
    }
    const primary = normalized.split("-")[0];
    return (SUPPORTED_LOCALES as readonly string[]).find(
        (locale) => locale === primary || locale.startsWith(`${primary}-`),
    ) as SupportedLocale | undefined;
}

function parseAcceptLanguage(header: string): SupportedLocale | undefined {
    const entries = header
        .split(",")
        .map((part) => {
            const [tag, ...params] = part.trim().split(";");
            const qParam = params.find((p) => p.trim().startsWith("q="));
            const q = qParam ? Number(qParam.trim().slice(2)) : 1;
            return { tag: tag.trim(), q: Number.isFinite(q) ? q : 0 };
        })
        .filter((e) => e.tag && e.q > 0)
        .sort((a, b) => b.q - a.q);
    for (const { tag } of entries) {
        const match = matchSupportedLocale(tag);
        if (match) return match;
    }
    return undefined;
}

export const getInitialLocale = createIsomorphicFn()
    .server((): SupportedLocale | undefined => {
        const header = getRequestHeader("accept-language");
        return header ? parseAcceptLanguage(header) : undefined;
    })
    .client((): SupportedLocale | undefined => undefined);

const resources = {
    en: { translation: en },
    "zh-cn": { translation: zhCN },
};

const isBrowser = typeof window !== "undefined";

const instance = i18n.use(initReactI18next);
if (isBrowser) {
    instance.use(LanguageDetector);
}

instance.init({
    resources,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    lng: isBrowser ? undefined : DEFAULT_LOCALE,
    lowerCaseLng: true,
    interpolation: { escapeValue: false },
    detection: {
        order: ["localStorage", "htmlTag", "navigator"],
        caches: ["localStorage"],
    },
    returnNull: false,
});

export default i18n;
