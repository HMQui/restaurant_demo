import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import authAction from '../../store/actions/authAction';
import typesAction from '../../store/actions/typesAction';
import infoUserAction from '../../store/actions/infoUserAction';

function LoginSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {            
            dispatch(authAction(typesAction.LOGIN))
            dispatch(infoUserAction())
        };
        fetch()
        navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
}

export default LoginSuccess;
