import MdiIconDone from "@mui/icons-material/Done";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../i18n";

export default function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const current = (SUPPORTED_LOCALES as readonly string[]).includes(
        i18n.resolvedLanguage ?? "",
    )
        ? (i18n.resolvedLanguage as SupportedLocale)
        : undefined;

    const handleSelect = (locale: SupportedLocale) => {
        i18n.changeLanguage(locale);
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="Change language"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                className="sm:mr-5"
            >
                <LanguageIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: { className: "rounded-2xl overflow-hidden" },
                }}
            >
                {SUPPORTED_LOCALES.map((locale) => (
                    <MenuItem
                        key={locale}
                        lang={locale}
                        selected={locale === current}
                        onClick={() => handleSelect(locale)}
                        className="flex justify-end gap-2"
                    >
                        {locale === current && <MdiIconDone />}
                        {t(`languages.${locale}`)}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
