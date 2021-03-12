import { Button } from 'antd';
import Search from './Search';

const columns = [
    {
        label: '关键字',
        prop: 'ketWorld',
    }
];

const App = () => {
    return (
        <div className="App">
            <Search columns={columns} />
        </div>
    );
};

export default App;
