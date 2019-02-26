import CreateItem from '../components/CreateItem';
import PleaseSignIn from '../components/PleaseSignIn';

const sell = props => (
    <div>
        <PleaseSignIn>
           <CreateItem />
        </PleaseSignIn>
    </div>
);

export default sell;