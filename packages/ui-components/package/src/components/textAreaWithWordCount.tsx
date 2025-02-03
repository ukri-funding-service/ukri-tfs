import { Hint, Textarea } from 'govuk-react-jsx';
import React, { useEffect, useState } from 'react';
import { getWordCount } from '../helpers';

export interface TextAreaWithWordCountProps {
    id?: string;
    name: string;
    rows: number;
    maxWordCount: number;
    defaultValue?: string;
}

export const TextAreaWithWordCount: React.FunctionComponent<TextAreaWithWordCountProps> = props => {
    const { defaultValue, maxWordCount } = props;
    const [wordCountRemaining, setWordCountRemaining] = useState<number>();
    const [isOverAllowedWordCount, setIsOverAllowedWordCount] = useState<boolean>(false);

    const updateWordCount = (text: string) => {
        if (maxWordCount) {
            const {
                wordCountRemaining: updatedWordCountRemaining,
                isOverAllowedWordCount: updatedIsOverAllowedWordCount,
            } = getWordCount(text, maxWordCount);

            setWordCountRemaining(updatedWordCountRemaining);
            setIsOverAllowedWordCount(updatedIsOverAllowedWordCount);
        }
    };

    useEffect(() => {
        updateWordCount(defaultValue ?? '');
    }, []);

    const textAreaOnChange = (e: React.FormEvent<HTMLTextAreaElement>) => updateWordCount(e.currentTarget.value ?? '');

    const renderWordCount = (): React.ReactNode | void => {
        if (!wordCountRemaining === undefined) return;

        const { name } = props;
        const hintText = isOverAllowedWordCount
            ? `You are ${Math.abs(wordCountRemaining!)} word${wordCountRemaining === -1 ? '' : 's'} over the limit`
            : `You have ${wordCountRemaining} word${wordCountRemaining === 1 ? '' : 's'} remaining`;
        if (isOverAllowedWordCount) {
            return (
                <span
                    id={`more-detail-info-${name}`}
                    className="govuk-error-message text-area-word-count"
                    aria-live="polite"
                >
                    {hintText}
                </span>
            );
        }
        return (
            <Hint id={'more-detail-info-' + name} className="text-area-word-count" aria-live="polite">
                {hintText}
            </Hint>
        );
    };

    return (
        <>
            <Textarea {...props} onChange={textAreaOnChange} />
            {renderWordCount()}
        </>
    );
};
