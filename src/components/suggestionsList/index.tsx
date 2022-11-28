import { 
    FC, 
    memo, 
    MouseEventHandler, 
    useCallback, 
    useEffect, 
    useMemo, 
    useRef, 
    useState
} from "react";

import './index.css';

export interface SuggestionsListProps {
    list: string[];
    highlightTerm?: string;
    maxLength?: number;
    selectCallback?: (item: string) => void
}

const SuggestionsList: FC<SuggestionsListProps> = ({ list = [], highlightTerm, maxLength = 10, selectCallback }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const root = useRef(null);

    const isSelected = useMemo(() => (index: number) => {
        if (index === selectedIndex) {
            return 'selected';
        }
        return '';
    }, [selectedIndex]);

    const curLength = useMemo(() => Math.min(list.length, maxLength), [list.length, maxLength]);

    const keyDownHandler = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            setSelectedIndex(state => state > 0 ? state - 1 : state);
        }
        else if (event.key === 'ArrowDown') {
            setSelectedIndex(state => state < curLength - 1 ? state + 1 : state);
        } else if (event.key === 'Enter') {
            selectCallback?.(list[selectedIndex])
        }
    }, [list, curLength, selectCallback, selectedIndex]);

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        }
    }, [keyDownHandler]);

    useEffect(() => setSelectedIndex(0), [list]);

    // we need this separate 'highlightTerm' variable to highlight text only when async data was loaded
    const renderHighlitghedText = useCallback((value: string) => {
        if (highlightTerm) {
            const regex = new RegExp(`(${highlightTerm})`, 'gi');
            const parts = value.split(regex);
            if (parts.length > 1) {
                return (
                    <>
                        {parts.filter(i => i).map((part, i) => (
                            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
                        ))}
                    </>
                );
            }
        }
        return <span>{value}</span>
    }, [highlightTerm]);

    const clickHandler = useCallback<MouseEventHandler>((e) => {
        e.stopPropagation();
        selectCallback?.(list[selectedIndex]);
    }, [list, selectCallback, selectedIndex])

    return (
        <ul id="suggestions-list" ref={root}>
            {list.slice(0, maxLength).map((item, index) =>
                <li key={`${index}_${item}`} 
                    onClick={clickHandler} 
                    className={isSelected(index)}>{renderHighlitghedText(item)}</li>)}
        </ul>
    )
}

export default memo(SuggestionsList);