import React from 'react';
import { Input } from 'govuk-react-jsx';
import { DatePicker } from './datePicker';
import { InputFieldBoilerplateProps } from '../propDefinition';

export interface DateProps {
    name: string;
    label: string;
    hint?: string;
    value?: string;
    minDate?: Date;
    maxDate?: Date;
    onChange?: (date: string) => void;
    formatDateInput: (date: Date) => string;
    formatMonthDropdown: (date: Date) => string;
    container?: () => HTMLElement;
}

export interface DateState {
    value?: string;
    showPicker: boolean;
    allowPopup: boolean;
}

/**
 * @deprecated this component is based on the deprecated DatePicker component, which does not
 * meet accessibility requirements. Prefer a standards-compliant DatePicker instead.
 */
export class TfsDatePicker extends React.Component<DateProps & InputFieldBoilerplateProps, DateState> {
    public constructor(props: DateProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = { value: props.value || '', showPicker: false, allowPopup: true };
    }

    public componentDidUpdate(prevProps: DateProps): void {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value || '' });
        }
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ value: event.target.value });

        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }

    private preventAutoDatePopup() {
        // this is required in order to prevent the bpk popup from being rendered immediately
        // after being closed (it gives focus back to the input component by default)
        this.setState({ showPicker: false });
        setTimeout(() => this.setState({ allowPopup: true }), 100);
    }

    private showPicker() {
        if (!this.state.showPicker && this.state.allowPopup) {
            this.setState({ showPicker: true, allowPopup: false });
        }
    }

    private getDateFromStringValue(value: string): Date {
        const dateParts = value.split('/');
        if (dateParts.length < 2) {
            return new Date('Invalid date');
        }
        const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return date;
    }

    public render(): JSX.Element {
        const inputField = (
            <Input
                id={this.props.name}
                hint={{ children: this.props.hint }}
                errorMessage={
                    this.props.validation?.errorMessage
                        ? {
                              children: [this.props.validation.errorMessage],
                          }
                        : null
                }
                label={{ children: [this.props.label], className: ['govuk-label--s'] }}
                name={this.props.name}
                value={this.state.value}
                onChange={this.onChange}
                onClick={(_e: React.MouseEvent) => this.showPicker()}
                onFocus={(_e: React.FocusEvent) => this.showPicker()}
                describedBy={this.props.describedBy}
                className="govuk-input--width-7"
            />
        );

        let initialDate = this.state.value ? this.getDateFromStringValue(this.state.value) : new Date();

        if (initialDate.toString() === 'Invalid Date') initialDate = new Date();

        return (
            <DatePicker
                id={this.props.name}
                isOpen={this.state.showPicker}
                targetElement={inputField}
                initialDate={initialDate}
                onDateSelected={(date: Date) => {
                    this.setState({ value: this.props.formatDateInput(date) });
                    this.preventAutoDatePopup();
                }}
                onPopupClose={() => this.preventAutoDatePopup()}
                formatDateInput={this.props.formatDateInput}
                formatMonthDropdown={this.props.formatMonthDropdown}
                formatFullDate={this.props.formatDateInput}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                container={this.props.container}
            />
        );
    }
}
