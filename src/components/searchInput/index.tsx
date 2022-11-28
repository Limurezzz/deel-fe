import { 
    ChangeEventHandler, 
    forwardRef, 
    memo, 
    MouseEventHandler, 
    useCallback, 
    useEffect, 
    useRef
} from "react";

import './index.css';

const {
    REACT_APP_DEBOUNCE_TIMEOUT = 200
} = process.env;

interface SearchInputProps {
    onChangeCallback: (value: string) => void,
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ onChangeCallback }, ref) => {
    const timeoutID = useRef<NodeJS.Timeout>();
    const debouncedSearchTermOnChange: ChangeEventHandler<HTMLInputElement> =
        useCallback(({ target: { value } }) => {
            clearInterval(timeoutID.current);
            timeoutID.current = setTimeout(() => {
                onChangeCallback(value);
            }, Number(REACT_APP_DEBOUNCE_TIMEOUT));
        }, [onChangeCallback]);

    const keyDownHandler = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
        }
    }, []);

    const stopPropagationOnClick: MouseEventHandler = useCallback(e => e.stopPropagation(), []);

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        return () => window.removeEventListener('keydown', keyDownHandler);
    }, [keyDownHandler]);
    
    return (
        <>
            <div>Search:</div>
            <input
                className="search-input"
                type="text"
                onClick={stopPropagationOnClick}
                onChange={debouncedSearchTermOnChange} ref={ref} />
        </>);
});

export default memo(SearchInput);