import React from 'react';

import { GdsTabGroup } from './tabGroup';
import { GdsTab } from './tab';
import { TabStateSetter, useSticky } from '../../hooks';

/*
    To use:
    - create a StickyTabs element in page with a scrollPositionMap that persists over rerender
    - Put each tabs content inside a TabContainer and always render them.
    - Create a TabHook on your page. Pass through the tab and scroll state from it into the above elements.
*/

export const TabContainer = <TabType extends string>({
    tab,
    currentTab,
    children,
    jsEnabled,
}: {
    tab: TabType;
    currentTab: TabType;
    children: React.ReactNode;
    jsEnabled: boolean;
}): JSX.Element => {
    return (
        <div id={tab} style={{ display: !jsEnabled || tab === currentTab ? 'block' : 'none' }}>
            {children}
        </div>
    );
};

export interface TabProp<TabType extends string> {
    id: string;
    label: string | React.ReactNode;
    tab: TabType;
    url: string;
}

export interface StickyTabProps<TabType extends string> {
    id: string;
    tabProps: TabProp<TabType>[];
    tab: TabType;
    setTabState: TabStateSetter<TabType>;
    scrollPositionMap: { [key in TabType]?: number };
}

export const StickyTabs = <TabType extends string>(props: StickyTabProps<TabType>): JSX.Element => {
    const { isSticky, stickyContainer } = useSticky();

    const onTabClick = (tabLink: TabType): React.MouseEventHandler => {
        return (event: React.MouseEvent) => {
            event.preventDefault();
            const scrollTop = stickyContainer!.current!.getBoundingClientRect().top + window.scrollY;
            props.scrollPositionMap[props.tab] = window.scrollY;
            // don't scroll higher than the top of the tab buttons
            const scrollPosition = Math.max(props.scrollPositionMap[tabLink] ?? 0, scrollTop);
            props.setTabState({ tab: tabLink, scrollPosition });
        };
    };

    const tabs = props.tabProps.map(tabProp => {
        return (
            <GdsTab
                key={tabProp.id}
                id={tabProp.id}
                label={tabProp.label}
                selected={props.tab === tabProp.tab}
                url={tabProp.url}
                onClick={onTabClick(tabProp.tab)}
            />
        );
    });

    return (
        <div ref={stickyContainer}>
            <GdsTabGroup id={props.id} sticky={isSticky}>
                {tabs}
            </GdsTabGroup>
        </div>
    );
};
