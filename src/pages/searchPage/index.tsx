import { createRef, FC, memo, useCallback, useEffect, useState } from "react";

import Loading from "../../components/loading";
import SearchInput from "../../components/searchInput";
import SuggestionsList from "../../components/suggestionsList";
import { getMockDataQuery } from "../../queries";
import { escapeSymbols } from "../../utilities";

import './index.css';

const SearchPage: FC = () => {
    const [data, setData] = useState<string[]>([]);
    const [searchTermForQuery, setSearchTermForQuery] = useState<string>();
    const [searchTermForHighlight, setSearchTermForHighlight] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const inputRef = createRef<HTMLInputElement>();

    const getQueryWithHandlers = useCallback((searchQuery?: string) => {
        return getMockDataQuery(searchQuery)
            .then((result: string[]) => {
                setData(result);
                setError(undefined);
                // encode symbols of the string to search RegExp correctly
                setSearchTermForHighlight(escapeSymbols(searchQuery));
            })
            .catch(e => {
                setError(e.message);
                setSearchTermForHighlight(undefined);
                setData([]);
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    // load mock data on searchTermForQuery change; on component mount will load all data with no filtering
    useEffect(() => {
        if (!searchTermForQuery) {
            setData([]);
            setLoading(false);
            return;
        }
        getQueryWithHandlers(searchTermForQuery)
    }, [searchTermForQuery, getQueryWithHandlers]);

    const inputCallback = useCallback((value: string) => {
        const trimmedValue = value.trim();
        if (searchTermForQuery === trimmedValue) {
            return;
        }
        setLoading(true);
        setSearchTermForQuery(trimmedValue.toLowerCase());
    }, [searchTermForQuery]);

    const selectCallback = useCallback((value: string) => {
        setLoading(false);
        if (inputRef.current) {
            inputRef.current.value = value;
            setData([]);
        }
    }, [inputRef]);

    const sideClickHandler = useCallback(() => {
        setLoading(false);
        setData([]);
    }, []);

    useEffect(() => {
        window.addEventListener('click', sideClickHandler);
        return () => {
            window.removeEventListener('click', sideClickHandler);
        }
    }, [sideClickHandler]);

    return (
        <div className="suggestions-wrapper">
            <div className="loading-absolute">
                <Loading state={loading} error={error} />
            </div>
            <SearchInput onChangeCallback={inputCallback} ref={inputRef} />
            <SuggestionsList list={data} highlightTerm={searchTermForHighlight} selectCallback={selectCallback} />
        </div>);
}

export default memo(SearchPage);