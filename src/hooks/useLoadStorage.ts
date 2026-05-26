import { useState } from "react";

export default function useLoadStorage<T extends object>(
    key: string,
    pathname :string
): Partial<T> {

    const [value] = useState<Partial<T>>(() => {
        const storage = window.localStorage.getItem(
            `gcm-calulator-storage::${pathname}.${key}`,
        );
        if (!storage) return {};
        try {
            return JSON.parse(storage) as Partial<T>;
        } catch {
            return {};
        }
    });

    return value;
}
