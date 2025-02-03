import React from 'react';

const focusAndScrollToError = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    const target: Partial<HTMLAnchorElement> = event.target;
    if (target.getAttribute) {
        const anchor = target.getAttribute('href');
        if (anchor && anchor.charAt(0) === '#') {
            const elementId = anchor.substring(1);
            const element = document.getElementById(elementId);
            const wrapper = document.getElementById(`${elementId}-wrapper`);
            const tinyMCE = (window as any).tinyMCE;
            const rte = tinyMCE ? tinyMCE.editors[`${elementId}__rte_hidden`] : null;

            if (rte) {
                rte.focus();
            } else if (element) {
                const inputs = element.getElementsByTagName('input');

                if (inputs && inputs.length) {
                    inputs[0].focus();
                } else {
                    element.focus();
                }
            }

            if (wrapper) {
                wrapper.scrollIntoView(true);
            } else if (element) {
                let parent = element.parentElement;
                while (parent) {
                    if (parent.classList.contains('govuk-form-group') || parent.classList.contains('error-target')) {
                        parent.scrollIntoView(true);
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        }
    }
};

export default focusAndScrollToError;
