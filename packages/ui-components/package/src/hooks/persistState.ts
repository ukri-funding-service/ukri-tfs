import { useEffect, useState } from 'react';

export default function usePersistState<T>(defaultValue: T, id: string): [T, (new_state: T) => void] {
    const [state, setState] = useState(defaultValue);

    useEffect(() => {
        const localStorageValue = localStorage.getItem('collapsibleCheckboxesExpanded:' + id);
        setState(localStorageValue ? JSON.parse(localStorageValue) : defaultValue);
    }, []);

    useEffect(() => {
        const stateString = JSON.stringify(state);
        localStorage.setItem('collapsibleCheckboxesExpanded:' + id, stateString);
    }, [state]);

    return [state, setState];
}
