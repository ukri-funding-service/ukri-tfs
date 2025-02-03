import React from 'react';

interface CompletionStatusProps {
    isComplete?: boolean;
    ariaLabel?: string;
}

export class CompletionStatus extends React.Component<CompletionStatusProps, {}> {
    private getIsCompleteText = () => (this.props.isComplete ? 'Complete' : 'Incomplete');

    render(): React.ReactElement {
        return (
            <div
                className={`completion-status completion-status--${this.getIsCompleteText().toLowerCase()}`}
                aria-label={this.props.ariaLabel ?? `This section is ${this.getIsCompleteText()}`}
            >
                {this.getIsCompleteText()}
            </div>
        );
    }
}
