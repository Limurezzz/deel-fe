## 1. What is the difference between Component and PureComponent? give an example where it might break my app.

PureComponent implements ShouldComponentUpdate() which shallowly compares the objects (props and state) and let React know whether component should do re-render. You can also implement this behavior for simple Component but better use PureComponent basic functionality. Comparison happens by object reference. It means that you need to support immutability of your objects. If you modify something deep inside the object without immutability - React won't notice it and you won't see updated HTML.

## 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
All consumers who are descendants of a context provider will be updated in case value of a context has been changed. Even if shouldComponentUpdate() prevents component from rendering. If context change happens too often - might be a good idea to split the context.

## 3. Describe 3 ways to pass information from a component to its PARENT.
1. You can pass callback setter to modify parent state. Example:
```
const Parent = () => {
    const [state, setState] = useState({});
    return <Child modifyParentHandler={setState} />;
}
```
2. You can use React.Context. Example
```
const MyContext = React.createContext();

function App() {
    const [state, setState] = useState({});

    return (
        <MyContext.Provider value={{state, setState}}>
            <Parent>
                <Child />
            </Parent>
        </MyContext.Provider>
);
}
```
This way in Child component you can modify this shared state. In Parent component you will see the updated state.

3. The last way I guess is some 3rd party Store Manager like Redux. Under the hood it also uses React.Context. But it has more  funcationality and supports Event Sourcing pattern.

## 4. Give 2 ways to prevent components from re-rendering.
- For functional component React.memo(FC).
- For class component extends PureFunction (or custom implementation of ShouldComponentUpdate when extending from simple class Component)
- Also new hooks inside the component can help to prevent component from re-rendering: useMemo, useCallback.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.
Fragment let's you return multiple items as render result with no need to cover it with extra <div> or <span> which in some cases breaks HTML symantics and create addition node in HTML structure.

Example:
```
return (
    <table>
        <td>1</td>
        <ColumnsRenderer />
    </table>);

const ColumnsRenderer = () => {
    return (
        <div>
            <td>2</td>
            <td>3</td>
            <td>4</td>
        </div>
        );
}

Erorr: <div> can't appear as <tr> child
```

## 6. Give 3 examples of the HOC pattern.
HOC is a function that takes a component and returns a new component.
```
// Redux connect HOC
const ConnectedMyComponent = connect(selectors, actions)(MyComponent);

// Function component HOC
function Page() {
    return (<h1>Hello world</h1>);
}
function withLogging(WrappedComponent) {
    console.log(WrappedComponent.name, 'rendered');
    return () => <WrappedComponent />;
}
export withLogging(Page));

// Return class component withLogging
function withLogging(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('CurProps: ', this.props);
      console.log('PrevProps: ', prevProps);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

```

7. what's the difference in handling exceptions in promises, callbacks and async...await.

Promise
```
promise.then(result => successHandler(result)).catch(e => errorHanlder(e))
```
Callback
```
doRequest(url, (err, res) => {
    if (err) {
        console.log(err.message);
        throw err;
    }
    return res;
})
```
async...await
```
async doReqeust() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    } catch (e) {
        console.log(err.message);
        throw e;
    }
}
```
## 8. How many arguments does setState take and why is it async.
State updating is asynchronous process - multiple state updates can be batched together. There is no garantee that after you did setState the state was updated. Better pass callback function as 2nd paramter.
Aslo 1st parameter can be an object or a function 
```
this.setState((state, props) => {
    return {smth: state.param1 + props.param2};
})
// in this case state and props are garanteed to be up to dated.
```

## 9. List the steps needed to migrate a Class to Function Component.
1. Move out state and lifecycle methods
2. Add hooks to store every state variable: useState, useRef
3. Replace lifecycle methods with hooks:
componentWillReceiveProps -> 
```
useEffect(() => {}, [listOfNeededDependencies])
```
componentWillMount, componentWillUnMount -> 
```
useEffect(() => {
    onMount()
    return onUnMount
  },[])
```
4. Also useMemo, useCallback, react.Memo for optimization instead of PureComponent or ShouldComponentUpdate().

## 10. List a few ways styles can be used with components.
```
import './index.css';
import './index.scss'; // if webpack has scss loader

// css modules
import style from './index.css';
// then use this style as object where keys are class names like:
<div className={style.myClass}></div>

// inline style
const spanStyles = { color: '#fff', borderColor: '#000' };
<span style={spanStyles}>name</span>

// inject syles library
import injectSheet from "react-jss";
const styles = { color: '#fff', borderColor: '#000' };
injectSheet(styles)(MyComponent);

// styled components
import styled, { css } from "styled-components";
const Container = styled.div`
  text-align: center;
`
render(
  <Container>
    <div>Normal Button</div>
  </Container>
);
```
## 11. How to render an HTML string coming from the server.
We can use dangerouslySetInnerHTML node attribute. But need to take care about XSS attack.
```
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```