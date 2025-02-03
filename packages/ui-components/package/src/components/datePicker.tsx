import React from 'react';
import { Calendar, Popover, Modal, Breakpoint, BPK_BREAKPOINTS } from '@ukri-tfs/bpk-components';

interface DatePickerProps {
    id: string;
    targetElement: JSX.Element;
    initialDate?: Date;
    isOpen: boolean;
    minDate?: Date;
    maxDate?: Date;
    container?: () => HTMLElement;
    onDateSelected: (date: Date) => void;
    onPopupClose: () => void;
    formatDateInput: (date: Date) => string;
    formatFullDate: (date: Date) => string;
    formatMonthDropdown: (date: Date) => string;
}

interface DatePickerState {
    selectedDate?: Date;
}

const daysOfWeek = [
    {
        name: 'Sunday',
        nameAbbr: 'Sun',
        index: 0,
        isWeekend: true,
    },
    {
        name: 'Monday',
        nameAbbr: 'Mon',
        index: 1,
        isWeekend: false,
    },
    {
        name: 'Tuesday',
        nameAbbr: 'Tue',
        index: 2,
        isWeekend: false,
    },
    {
        name: 'Wednesday',
        nameAbbr: 'Wed',
        index: 3,
        isWeekend: false,
    },
    {
        name: 'Thursday',
        nameAbbr: 'Thu',
        index: 4,
        isWeekend: false,
    },
    {
        name: 'Friday',
        nameAbbr: 'Fri',
        index: 5,
        isWeekend: false,
    },
    {
        name: 'Saturday',
        nameAbbr: 'Sat',
        index: 6,
        isWeekend: true,
    },
];

/**
 * @deprecated This component uses bpk-components Calendar which does not meet
 * accessibility requirements. Prefer a standards-compliant DatePicker instead.
 */
export class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    constructor(props: DatePickerProps) {
        super(props);
        this.state = { selectedDate: props.initialDate };
    }

    handleDateSelect = (date: Date): void => {
        const momentDate = new Date(date);
        this.setState({ selectedDate: momentDate });
        this.props.onDateSelected && this.props.onDateSelected(momentDate);
    };

    closePopover = (): void => this.props.onPopupClose && this.props.onPopupClose();

    render(): JSX.Element {
        const closeLabelText = 'Close';
        const selectDateText = 'Select a date';

        const calendar = (
            <Calendar
                id={`${this.props.id}_datepicker`}
                daysOfWeek={daysOfWeek}
                weekStartsOn={1}
                changeMonthLabel="Change month"
                closeButtonText="Close"
                title={selectDateText}
                formatDate={this.props.formatDateInput}
                formatMonth={this.props.formatMonthDropdown}
                formatDateFull={this.props.formatDateInput}
                onDateSelect={this.handleDateSelect}
                date={this.state.selectedDate}
                initiallyFocusedDate={this.state.selectedDate || new Date()}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
            />
        );

        const container = this.props.container || (() => document.getElementById('__next'));

        return (
            <Breakpoint query={BPK_BREAKPOINTS.MOBILE}>
                {(isMobile: boolean) =>
                    isMobile ? (
                        <Modal
                            id={`${this.props.id}_modal`}
                            target={this.props.targetElement}
                            onClose={this.closePopover}
                            isOpen={this.props.isOpen}
                            getApplicationElement={container}
                            title={selectDateText}
                            closeLabel={closeLabelText}
                            fullScreenOnMobile={true}
                        >
                            {calendar}
                        </Modal>
                    ) : (
                        <>
                            {this.props.targetElement}
                            <Popover
                                id={`${this.props.id}_popover`}
                                target={() => document.getElementById(this.props.id)}
                                isOpen={this.props.isOpen}
                                onClose={this.closePopover}
                                label={selectDateText}
                                closeButtonText={closeLabelText}
                                tabIndex={0}
                            >
                                {calendar}
                            </Popover>
                        </>
                    )
                }
            </Breakpoint>
        );
    }
}
