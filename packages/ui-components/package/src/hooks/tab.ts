import { Reducer, useLayoutEffect, useReducer } from 'react';

interface TabState<TEnum> {
    tab: TEnum;
    scrollPosition: null | number;
}

export type TabStateSetter<TEnum> = React.Dispatch<Partial<TabState<TEnum>>>;

export interface TabHook<TEnum> {
    state: TabState<TEnum>;
    setState: TabStateSetter<TEnum>;
}

export const useTab = <TEnum>(tab: TEnum): TabHook<TEnum> => {
    // Use reducer to allow for changing multiple state vars simultaneously.
    const [state, setState] = useReducer<Reducer<TabState<TEnum>, Partial<TabState<TEnum>>>>(
        (s, newS) => ({ ...s, ...newS }),
        {
            tab,
            scrollPosition: null,
        },
    );

    useLayoutEffect(() => {
        if (state.scrollPosition) {
            if (window.scrollY === state.scrollPosition) {
                // trigger scroll event even if theres no scroll needed so page can adjust.
                window.dispatchEvent(new CustomEvent('scroll'));
            } else {
                window.scrollTo({ top: state.scrollPosition });
            }
        }
    });

    const hook = { state, setState };
    return hook;
};
