// eslint-disable-next-line node/no-extraneous-import
import _ from 'lodash';
import { useEffect, useState, useRef, RefObject } from 'react';

export const useSticky = (
    stickToBottom?: boolean,
): { isSticky: boolean; stickyContainer: RefObject<HTMLDivElement> } => {
    const [isSticky, setSticky] = useState(false);
    const stickyContainer = useRef<HTMLDivElement>(null);

    const handleScroll = _.debounce(() => {
        if (stickyContainer?.current) {
            const stickyContainerTop = stickyContainer.current.getBoundingClientRect().top;
            const stickyContainerBottom = stickyContainer.current.getBoundingClientRect().bottom;

            if (stickyContainerTop < 0 && (!stickToBottom || stickyContainerBottom > window.innerHeight)) {
                if (!isSticky) {
                    // calculate height of sticky element
                    const stickyElement = stickyContainer.current.children[0];
                    const marginBottom = parseInt(
                        window.getComputedStyle(stickyElement).marginBottom,
                    ); /* assumes height in px */
                    const heightOfStickyElement = stickyElement.scrollHeight + marginBottom;

                    if (!stickToBottom) {
                        // and add it to the container so that the spacing is maintained.
                        stickyContainer.current.style.paddingTop = heightOfStickyElement + 'px';
                    }

                    setSticky(true);
                }
            } else {
                if (isSticky) {
                    setSticky(false);
                    stickyContainer.current.style.paddingTop = '0px';
                }
            }
        }
    }, 5);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, [handleScroll]);

    return { isSticky, stickyContainer };
};
