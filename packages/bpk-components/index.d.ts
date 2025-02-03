import React from 'react';

export class CalendarProps {
    id?: string;
    daysOfWeek?: any;
    weekStartsOn?: number;
    changeMonthLabel?: string;
    closeButtonText?: string;
    title?: string;
    date?: Date;
    initiallyFocusedDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    formatDate?: (date: Date) => string;
    formatMonth?: (date: Date) => string;
    formatDateFull?: (date: Date) => string;
    onDateSelect?: (date: any) => any;
}

export class PopoverProps {
    id: string;
    label: string;
    closeButtonText: string;
    target: JSX.Element | (() => HTMLElement | null);
    isOpen: boolean;
    tabIndex: number;
    onClose: () => void;
    children: React.ReactNode;
}

export class ModalProps {
    id?: string;
    title: string;
    closeLabel: string;
    target: JSX.Element;
    isOpen: boolean;
    fullScreen?: boolean;
    fullScreenOnMobile?: boolean;
    onClose: () => void;
    getApplicationElement: () => HTMLElement;
}

export class BreakpointProps {}

export class Calendar extends React.Component<CalendarProps, any> {}
export class Popover extends React.Component<PopoverProps, any> {}
export class Modal extends React.Component<any, any> {}
export class Breakpoint extends React.Component<any, any> {}
export class DatePicker extends React.Component<any, any> {}

export const BPK_BREAKPOINTS: {
    MOBILE: any;
};
