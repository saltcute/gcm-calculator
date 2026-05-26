import { useEffect } from "react";

export default function useStorage(
    key: string,
    content: string,
    pathname: string,
) {
    useEffect(() => {
        window.localStorage.setItem(
            `gcm-calulator-storage::${pathname}.${key}`,
            content,
        );
    }, [pathname, key, content]);
}
