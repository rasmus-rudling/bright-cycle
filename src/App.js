import logo from './logo.svg';
import './App.css';
import InteractiveMap from './components/InteractiveMap/ThreeJSExample/InteractiveMap';
import BasicBoxExample from './components/InteractiveMap/BasicBoxExample/BasicBoxExample';

const App = () => {
    return (
        <div className="App">
            {/*<InteractiveMap />*/}
            <BasicBoxExample />
        </div>
    );
}

export default App;
