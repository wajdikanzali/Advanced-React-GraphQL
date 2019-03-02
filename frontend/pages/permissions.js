import PleaseSignIn from '../components/PleaseSignIn';
import Permissions from '../components/Permissions';

const PermissionsPage = props => (
    <div>
        <PleaseSignIn>
           <Permissions page= { parseFloat(props.query.page) || 1 }/>
        </PleaseSignIn>
    </div>
);

export default PermissionsPage;