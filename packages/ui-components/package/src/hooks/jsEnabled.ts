import { useState, useEffect } from 'react';

interface JsEnabledHook {
    jsEnabled: boolean;
}

export const useJsEnabled = (): JsEnabledHook => {
    const [jsEnabled, setJsEnabled] = useState(false);
    // runs on first load
    useEffect(() => {
        setJsEnabled(true);
    }, []);

    const hook = { jsEnabled };
    return hook;
};
