import { useState } from 'react';
import { Outlet } from 'react-router';
import { TextField, Button } from '@mui/material';

import verifyRootPassword from '../../../services/apis/verifyRootPassword';

function RootRoute() {
    const [input, setInput] = useState('');
    const [error, setError] = useState({
        error: false,
        message: '',
    });
    const [auth, setAuth] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const fetch = async () => {
            try {
                const res = await verifyRootPassword(input);
                if (res.error === 0) {                    
                    setAuth(true);
                } else {
                    setError({ error: true, message: res.message });
                }
            } catch (error) {
                console.error('Root password verification failed:', error);
            }
        };

        fetch();
    };

    if (auth) {
        return <Outlet />;
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <form className="flex flex-col gap-4 border p-4 rounded-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold">Enter The Root Password to Continue</h2>
                <TextField
                    label="Root Password"
                    type="password"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError({ error: false, message: '' });
                    }}
                    error={error.error}
                    helperText={error.message}
                />
                <Button variant="contained" sx={{ marginLeft: 'auto', width: '100px' }} type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default RootRoute;
