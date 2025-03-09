import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField, Button, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { SERVER_URL } from '../../config/globalVariables';
import GoogleLogo from '../assets/svg/GoogleLogo.svg';
import FacebookLogo from '../assets/svg/FacebookLogo.svg';
import MainLogo from '../assets/images/MainLogo.png';
import { localLogin } from '../../services/apis/authApis';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [empty, setEmpty] = useState({
        username: false,
        password: false,
    });
    const [successLocal, setSuccessLocal] = useState(true);
    const [visiblePassword, setVisiblePassword] = useState(false);

    const handleLoggInLocal = async (e) => {
        e.preventDefault();
        const isUsernameEmpty = !username.trim();
        const isPasswordEmpty = !password.trim();

        setEmpty({ username: isUsernameEmpty, password: isPasswordEmpty });

        if (!isUsernameEmpty && !isPasswordEmpty) {
            try {
                const res = await localLogin(username, password);

                if (res.error === 0) {
                    navigate('/login-success');
                } else {
                    setSuccessLocal(false);
                    console.error('Login failed:', res.message);
                }
            } catch (error) {
                console.error('Login request failed:', error);
            }
        }
    };

    const handleLoginWithThirdProvider = (provider) => {
        window.location.href = `${SERVER_URL}/auth/${provider}`;
    };

    return (
        <div className="w-full h-full bg-white flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-20 p-4">
            <div className="flex flex-col justify-start items-center">
                <img src={MainLogo} alt="" className="w-48 h-40 sm:w-64 sm:h-56 select-none" />
                <h1 className="text-lg sm:text-xl font-semibold text-accent-1 text-center">
                    Cyber and Gentle Restaurant
                </h1>
            </div>
            <div className="mt-6 sm:mt-10 flex flex-col justify-between items-center gap-2 w-full max-w-md">
                <div className="p-6 w-full max-w-[400px] rounded-2xl shadow-2xl shadow-accent-3 flex flex-col">
                    <form className="flex flex-col gap-4" onSubmit={handleLoggInLocal}>
                        <TextField
                            value={username}
                            label="Username or email"
                            error={empty.username || !successLocal}
                            helperText={
                                (empty.username && 'Username is required') ||
                                (!successLocal && 'Username or Password is incorrect!')
                            }
                            onChange={(e) => {
                                setEmpty((prev) => ({ ...prev, username: false }));
                                setSuccessLocal(true);
                                setUsername(e.target.value);
                            }}
                        />
                        <TextField
                            value={password}
                            label="Password"
                            error={empty.password || !successLocal}
                            helperText={
                                (empty.password && 'Password is required') ||
                                (!successLocal && 'Username or Password is incorrect!')
                            }
                            type={!visiblePassword ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <IconButton disableRipple onClick={() => setVisiblePassword((prev) => !prev)}>
                                        {visiblePassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                    </IconButton>
                                ),
                            }}
                            onChange={(e) => {
                                setEmpty((prev) => ({ ...prev, password: false }));
                                setSuccessLocal(true);
                                setPassword(e.target.value);
                            }}
                        />
                        <Button variant="contained" size="large" type="submit" className="w-full">
                            Log in
                        </Button>
                    </form>
                    <div className="mt-3 text-sm text-accent-1 flex flex-row justify-center items-center gap-2 select-none">
                        <Link to="/sign-up" className="hover:text-base-3">
                            Create new account
                        </Link>
                        <span>-</span>
                        <Link to="/forgot-password" className="hover:text-base-3">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="my-3 text-sm center flex flex-row justify-center items-center gap-4">
                        <hr className="grow-[1]" />
                        <span className="grow-0">OR</span>
                        <hr className="grow-[1]" />
                    </div>
                    <Button
                        variant="outlined"
                        startIcon={<img src={GoogleLogo} className="w-4" />}
                        size="large"
                        sx={{ marginBottom: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
                        onClick={() => handleLoginWithThirdProvider('google')}
                        className="w-full"
                    >
                        Continue with Google
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<img src={FacebookLogo} className="w-5" />}
                        size="large"
                        sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                        onClick={() => handleLoginWithThirdProvider('facebook')}
                        className="w-full"
                    >
                        Continue with Facebook
                    </Button>
                </div>
                <span className="text-sm text-center">
                    Log in for <b>more options</b>
                </span>
            </div>
        </div>
    );
}

export default Login;
