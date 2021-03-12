import { Button } from 'antd';
import Search from './Search';

const columns = [
    {
        label: '姓名',
        prop: 'a',
        defaultValue: 'aa'
    },
    {
        label: '性别',
        prop: 'b',
        defaultValue: 2,
        template: {
            tpl: 'select',
            data: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ]
        }
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
