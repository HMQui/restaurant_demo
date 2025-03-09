import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Typography,
    TextField,
    IconButton,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import isValidEmail from '../../services/isValidEmail';
import { createNewUser } from '../../services/apis/authApis';

function SignUp() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        username: '',
        password: '',
        email: '',
        fullname: '',
        sexual: '',
        dataOfBirth: null,
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState({
        password: true,
        confirmPassword: true,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isValidInfo, setIsValidInfo] = useState({
        username: true,
        password: true,
        confirmPassword: true,
        email: true,
        fullname: true,
    });
    const [dulicated, setDuplicated] = useState({
        username: false,
        email: false,
    });
    const [success, setSuccess] = useState(false);

    const notify = () => {
        toast.success('🦄 Wow so easy!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: false,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
        });
    };

    // Handle change input
    const handleChangeInput = (key, value) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Check valid info
    const checkIsValidInfo = () => {
        let isValid = true;

        if (!input.username.trim() || input.username.includes(' ')) {
            setIsValidInfo((prev) => ({ ...prev, username: false }));
            isValid = false;
        }

        if (!input.password.trim() || input.password.includes(' ') || input.password.length < 8) {
            setIsValidInfo((prev) => ({ ...prev, password: false }));
            isValid = false;
        }

        if (
            !confirmPassword.trim() ||
            confirmPassword.includes(' ') ||
            input.password !== confirmPassword ||
            confirmPassword.length < 8
        ) {
            setIsValidInfo((prev) => ({ ...prev, confirmPassword: false }));
            isValid = false;
        }

        if (!input.email.trim() || !isValidEmail(input.email)) {
            setIsValidInfo((prev) => ({ ...prev, email: false }));
            isValid = false;
        }

        if (!input.fullname.trim()) {
            setIsValidInfo((prev) => ({ ...prev, fullname: false }));
            isValid = false;
        }

        return isValid;
    };

    // Handle create account
    const handleCreateAccount = () => {
        let isValid = checkIsValidInfo();

        if (!isValid) return;

        const fetch = async () => {
            try {
                let res = await createNewUser(input);

                if (Array.isArray(res)) {
                    let isDuplicatedUsername = res.some((item) => item.field === 'username' && item.error === 1);
                    let isDuplicatedEmail = res.some((item) => item.field === 'email' && item.error === 1);

                    setDuplicated({
                        username: isDuplicatedUsername,
                        email: isDuplicatedEmail,
                    });

                    if (isDuplicatedUsername || isDuplicatedEmail) return;
                }
                setSuccess(true);
                notify();
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        };

        fetch();
    };

    return (
        <div className="py-20 w-full min-h-full flex flex-col justify-center items-center">
            <h1 className="mb-5 text-2xl font-bold text-base-5">Cyber and Gentle Restaurant</h1>
            <Box width="550px">
                <Card sx={{ paddingBottom: '20px' }}>
                    <CardHeader
                        title={
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                style={{ fontWeight: 'bold', color: '#035772' }}
                            >
                                Create a new account
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                Have an account to get more options!
                            </Typography>
                        }
                        style={{ textAlign: 'center' }}
                    />
                    <hr />
                    <CardContent
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: '15px',
                        }}
                    >
                        {/* Username input */}
                        <TextField
                            size="small"
                            value={input.username}
                            fullWidth
                            label="Username"
                            required
                            onChange={(e) => {
                                handleChangeInput('username', e.target.value);
                                setIsValidInfo((prev) => ({ ...prev, username: true }));
                                setDuplicated((prev) => ({ ...prev, username: false }));
                            }}
                            error={!isValidInfo.username || dulicated.username}
                            helperText={
                                (!isValidInfo.username && 'Username is required and not allow space') ||
                                (isValidInfo.username && dulicated.username && 'This Username has been existed!')
                            }
                        />

                        {/* Password input */}
                        <TextField
                            required
                            size="small"
                            fullWidth
                            label="New Password"
                            type={visiblePassword.password ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        disableRipple
                                        onClick={() =>
                                            setVisiblePassword((prev) => ({ ...prev, password: !prev.password }))
                                        }
                                    >
                                        {visiblePassword.password ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                    </IconButton>
                                ),
                            }}
                            onChange={(e) => {
                                handleChangeInput('password', e.target.value);
                                setIsValidInfo((prev) => ({ ...prev, password: true }));
                            }}
                            value={input.password}
                            error={!isValidInfo.password}
                            helperText={
                                !isValidInfo.password &&
                                'Password is required, not allow space and at least 8 characters'
                            }
                        />

                        {/* Confirm Password input */}
                        <TextField
                            required
                            size="small"
                            fullWidth
                            label="Confirmed Password"
                            type={visiblePassword.confirmPassword ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        disableRipple
                                        onClick={() =>
                                            setVisiblePassword((prev) => ({
                                                ...prev,
                                                confirmPassword: !prev.confirmPassword,
                                            }))
                                        }
                                    >
                                        {visiblePassword.confirmPassword ? (
                                            <VisibilityOffOutlined />
                                        ) : (
                                            <VisibilityOutlined />
                                        )}
                                    </IconButton>
                                ),
                            }}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setIsValidInfo((prev) => ({ ...prev, confirmPassword: true }));
                            }}
                            value={confirmPassword}
                            error={!isValidInfo.confirmPassword}
                            helperText={
                                !isValidInfo.confirmPassword &&
                                'Confirm Password is required and must be the same with Password'
                            }
                        />

                        {/* Email input */}
                        <TextField
                            size="small"
                            fullWidth
                            label="Email"
                            required
                            onChange={(e) => {
                                handleChangeInput('email', e.target.value);
                                setIsValidInfo((prev) => ({ ...prev, email: true }));
                                setDuplicated((prev) => ({ ...prev, email: false }));
                            }}
                            value={input.email}
                            error={!isValidInfo.email || dulicated.email}
                            helperText={
                                (!isValidInfo.email && 'Email is required and must be correct format') ||
                                (isValidInfo.email && dulicated.email && 'This Email has been existed!')
                            }
                        />

                        {/* Fullname input */}
                        <TextField
                            required
                            size="small"
                            fullWidth
                            label="Fullname"
                            onChange={(e) => {
                                handleChangeInput('fullname', e.target.value);
                                setIsValidInfo((prev) => ({ ...prev, fullname: true }));
                            }}
                            value={input.fullname}
                            error={!isValidInfo.fullname}
                            helperText={!isValidInfo.fullname && 'Fullname is required'}
                        />

                        <div className="flex flex-row justify-between items-center">
                            {/* Sexual input */}
                            <FormControl>
                                <FormLabel>Sexual</FormLabel>
                                <RadioGroup
                                    row
                                    value={input.sexual || 'unknown'}
                                    onChange={(e) => handleChangeInput('sexual', e.target.value)}
                                >
                                    <FormControlLabel control={<Radio />} label="Male" value="male" />
                                    <FormControlLabel control={<Radio />} label="Female" value="female" />
                                    <FormControlLabel control={<Radio />} label="None" value="unknown" />
                                </RadioGroup>
                            </FormControl>

                            {/* Data of Birth */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={input.dateOfBirth ? dayjs(input.dateOfBirth) : null}
                                    onChange={(newValue) =>
                                        handleChangeInput('dateOfBirth', newValue ? newValue.toISOString() : null)
                                    }
                                />
                            </LocalizationProvider>
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ margin: 'auto' }}
                            onClick={() => setOpenDialog(true)}
                            disabled={success}
                        >
                            Create new account
                        </Button>
                    </CardActions>
                    <hr />
                    <div className="mt-3 flex justify-center items-center">
                        <Link to="/login" className="text-accent-1">
                            Have an account yet?
                        </Link>
                    </div>
                </Card>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle>Create An New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please check the imformation carefully before SUBMIT</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpenDialog(false);
                            handleCreateAccount();
                        }}
                    >
                        Create
                    </Button>
                    <Button variant="text" onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

export default SignUp;
