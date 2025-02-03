import { ErrorMessageProps, Label, Select, ErrorMessage } from 'govuk-react-jsx';
import React from 'react';
import { Input, InputProps } from './input';
import { MeridianValue } from './time';
import { HeadingSize, HeadingText } from './heading';

export interface TimeEntryValues {
    hours: string;
    minutes: string;
    meridian: MeridianValue;
}

export interface TimeEntryProps {
    label: string;
    id?: string;
    hint?: string;
    headingSize?: HeadingSize;
    timeValue?: TimeEntryValues;
    onChange?: (time: TimeEntryValues) => void;
    errorMessage?: ErrorMessageProps;
}

export class TimeEntry extends React.Component<TimeEntryProps & InputProps> {
    public render(): JSX.Element {
        const hasError = !!this.props.errorMessage;
        const formClassName = 'govuk-form-group' + (hasError ? ' govuk-form-group--error' : '');

        return (
            <div className={formClassName} id={`${this.props.id ? this.props.id : ''}`}>
                <fieldset className="govuk-fieldset" role="group">
                    <legend className="govuk-fieldset__legend govuk-!-margin-bottom-0">
                        <HeadingText size={this.props.headingSize ?? 'm'} text={this.props.label} tag="h2" />
                    </legend>
                    {this.props.hint && <div className="govuk-hint">{this.props.hint}</div>}
                    {hasError && <ErrorMessage {...this.props.errorMessage} />}
                    <div className="govuk-date-input">
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <Label className="govuk-date-input__label" htmlFor={this.props.name + '-hours'}>
                                    Hour
                                </Label>
                                <Input
                                    name={this.props.name + '-hours'}
                                    widthSize="2"
                                    formGroupClassName="after-inline inline"
                                    defaultValue={this.props.timeValue ? this.props.timeValue.hours : ''}
                                ></Input>
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <Label className="govuk-date-input__label" htmlFor={this.props.name + '-minutes'}>
                                    Minute
                                </Label>
                                <Input
                                    name={this.props.name + '-minutes'}
                                    widthSize="2"
                                    formGroupClassName="after-inline inline"
                                    defaultValue={this.props.timeValue ? this.props.timeValue.minutes : ''}
                                ></Input>
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <Label className="govuk-date-input__label" htmlFor={this.props.name + '-meridian'}>
                                    am or pm
                                </Label>
                                <Select
                                    formGroup={{
                                        className: 'after-inline inline',
                                    }}
                                    name={`${this.props.name}-meridian`}
                                    id={`${this.props.name}-meridian`}
                                    defaultValue={
                                        this.props.timeValue?.meridian === MeridianValue.am
                                            ? MeridianValue.am
                                            : MeridianValue.pm
                                    }
                                    items={[{ children: MeridianValue.am }, { children: MeridianValue.pm }]}
                                >
                                    <option>{MeridianValue.am}</option>
                                    <option>{MeridianValue.pm}</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }
}
