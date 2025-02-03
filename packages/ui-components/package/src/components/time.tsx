import React from 'react';
import { Select } from 'govuk-react-jsx';
import { InputProps } from './input';
import { ValidationResult } from '@ukri-tfs/validation';

export enum MeridianValue {
    'am' = 'am',
    'pm' = 'pm',
}

export const toMeridianValue = (ampm: string): MeridianValue => (ampm === 'pm' ? MeridianValue.pm : MeridianValue.am);

const meridianLabel = 'Before or after midday';

export interface Time {
    time: string;
    ampm: MeridianValue;
}

export interface TimeProps {
    validation?: ValidationResult;
    defaultTime?: Time;
    timeValue?: Time;
    onChange?: (time: Time) => void;
}

export class BaseTimeComponent extends React.Component<TimeProps & InputProps> {
    private timeValue: Time;
    public constructor(props: TimeProps & InputProps) {
        super(props);
        this.timeValue = this.getTime();
    }

    private getTime(): Time {
        let time: Time;
        if (this.props.timeValue) {
            time = this.props.timeValue;
        } else if (this.props.defaultTime) {
            time = this.props.defaultTime;
        } else {
            time = { time: '', ampm: MeridianValue.am };
        }
        return time;
    }

    public render(): JSX.Element {
        const meridianFieldName = `${this.props.name}Meridian`;

        const timeOptions = [
            { children: '01:00' },
            { children: '02:00' },
            { children: '03:00' },
            { children: '04:00' },
            { children: '05:00' },
            { children: '06:00' },
            { children: '07:00' },
            { children: '08:00' },
            { children: '09:00' },
            { children: '10:00' },
            { children: '11:00' },
            { children: '12:00' },
        ];

        const errorMessage = this.props.validation ? this.props.validation.errorMessage : null;

        return (
            <React.Fragment>
                <div className={`govuk-form-group ${errorMessage && 'govuk-form-group--error'}`}>
                    <Select
                        formGroup={{
                            className: 'after-inline inline',
                        }}
                        label={{
                            children: this.props.label,
                            className: 'govuk-label--s',
                        }}
                        hint={{
                            children: this.props.hint,
                        }}
                        className="ukri-tfs-time-input govuk-!-margin-bottom-1 govuk-!-margin-right-1"
                        errorMessage={errorMessage ? { children: errorMessage } : undefined}
                        id={this.props.name}
                        name={this.props.name}
                        defaultValue={this.timeValue.time}
                        items={timeOptions}
                    />
                    <label className="govuk-visually-hidden" htmlFor={meridianFieldName}>
                        {meridianLabel}
                    </label>
                    <select
                        className={`govuk-select ukri-tfs-time-input${errorMessage ? ' govuk-select--error' : ''}`}
                        name={meridianFieldName}
                        id={meridianFieldName}
                        defaultValue={this.timeValue.ampm}
                    >
                        <option>{MeridianValue.am}</option>
                        <option>{MeridianValue.pm}</option>
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export const TfsTime = BaseTimeComponent;
