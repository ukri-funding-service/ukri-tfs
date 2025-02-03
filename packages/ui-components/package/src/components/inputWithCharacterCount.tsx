import React, { useEffect, useState } from 'react';
import { Input, InputProps } from './input';
import { Hint } from 'govuk-react-jsx';

export interface InputWithCharacterCountProps extends InputProps {
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
}

export const InputWithCharacterCount: React.FunctionComponent<InputWithCharacterCountProps> = props => {
    const { onChange, value, defaultValue, showCharacterCount, maxCharacterCount } = props;
    const [characterCountRemaining, setCharacterCountRemaining] = useState<number>();
    const [isOverAllowedCharacterCount, setIsOverAllowedCharacterCount] = useState<boolean>(false);

    const valueOrDefaultValue = (value ? value : defaultValue) ?? '';

    const updateCharacterCount = (text: string) => {
        if (maxCharacterCount) {
            setCharacterCountRemaining(maxCharacterCount - text.length);
            setIsOverAllowedCharacterCount(maxCharacterCount < text.length);
        }
    };
    useEffect(() => {
        updateCharacterCount(valueOrDefaultValue.toString());
    }, []);

    const onChangeWithUpdateCharacterCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
        updateCharacterCount(e.currentTarget.value ?? '');
    };

    const renderCharacterCount = (): React.ReactNode | void => {
        if (!showCharacterCount || characterCountRemaining === undefined) return;
        const { name } = props;
        const hintText = isOverAllowedCharacterCount
            ? `You are ${Math.abs(characterCountRemaining)} character${
                  characterCountRemaining === -1 ? '' : 's'
              } over the limit`
            : `You have ${characterCountRemaining} character${characterCountRemaining === 1 ? '' : 's'} remaining`;
        if (isOverAllowedCharacterCount) {
            return (
                <span id={`more-detail-info-${name}`} className="govuk-error-message" aria-live="polite">
                    {hintText}
                </span>
            );
        }
        return (
            <Hint id={'more-detail-info-' + name} aria-live="polite">
                {hintText}
            </Hint>
        );
    };

    return (
        <>
            <Input {...props} onChange={onChangeWithUpdateCharacterCount} />

            {renderCharacterCount()}
        </>
    );
};
