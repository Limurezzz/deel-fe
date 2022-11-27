import { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from "react";
import { getMockDataQuery } from "../../queries";
import { MockType } from "../../types/mockType";
import { encodeSymbols } from "../../utilities";
import './index.css';

const {
    REACT_APP_DEBOUNCE_TIMEOUT = 200
} = process.env;

const SearchPage: FC = () => {
    const [data, setData] = useState<MockType[]>([]);
    const [searchTermForQuery, setSearchTermForQuery] = useState<string>();
    const [searchTermForHighlight, setSearchTermForHighlight] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const timeoutID = useRef<NodeJS.Timeout>();

    const getQueryWithHandlers = useCallback((searchQuery?: string) => {
        return getMockDataQuery(searchQuery)
            .then((result: MockType[]) => {
                setData(result);
                setError(undefined);
                // encode symbols of the string to search RegExp correctly
                setSearchTermForHighlight(encodeSymbols(searchQuery));
            })
            .catch(e => {
                setError(e.message);
                setSearchTermForHighlight(undefined);
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    // load mock data on searchTermForQuery change; on component mount will load all data with no filtering
    useEffect(() => {
        getQueryWithHandlers(searchTermForQuery)
    }, [searchTermForQuery, getQueryWithHandlers]);

    // use debounce to let user quickly type 2-3 symbols in a row
    const debouncedSearchTermOnChange: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
        clearInterval(timeoutID.current);
        if (!value) {
            setSearchTermForQuery(undefined);
            return;
        }
        timeoutID.current = setTimeout(() => {
            setLoading(true);
            setSearchTermForQuery(value.toLowerCase());
        }, Number(REACT_APP_DEBOUNCE_TIMEOUT));
    }, []);

    // we need this separate 'searchTermForHighlight' variable to highlight text only when async data was loaded
    const renderHighlitghedText = useCallback((value: string) => {
        if (searchTermForHighlight) {
            const regex = new RegExp(`(${searchTermForHighlight})`, 'gi');
            const parts = value.split(regex);
            if (parts.length > 1) {
                return (
                    <span>
                        {parts.filter(i => i).map((part, i) => (
                            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
                        ))}
                    </span>
                );
            }
        }
        return <span>{value}</span>
    }, [searchTermForHighlight]);

    if (error) {
        return (
            <>
                <label className="mr-1">{error}</label>
                <button onClick={() => getQueryWithHandlers()}>Start over</button>
            </>);
    }

    return (
        <>
            <div>
                <label className="mr-1">Search:</label>
                <input type="text" className="mr-1" onChange={debouncedSearchTermOnChange} />
                {loading ? <span className="info">Loading...</span> : null}
            </div>
            <ul>
                {data.map((item: MockType, i) => (
                    <li key={i}>
                        {Object.keys(item).map((key) =>
                            <div className="label-row" key={key}>
                                <label className="title">{key}</label>
                                {renderHighlitghedText(item[key as keyof MockType].toString())}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </>);
}

export default SearchPage;