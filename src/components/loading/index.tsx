import { FC, memo } from "react";

interface LoadingProps {
    state?: boolean;
    error?: string;
}
const Loading: FC<LoadingProps> = ({ state, error }) => {
    return (
        <>
            {state ? <span>Loading...</span> :
                error ? <span>{error}</span> : null}
        </>);
}

export default memo(Loading);