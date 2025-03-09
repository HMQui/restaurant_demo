import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    IconButton,
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { resetPassword as resetPasswordFunction } from '../../services/apis/authApis';

const notify = (text, type = 'success', hideProgress, timeToClose = 2000) => {
    toast[type](text, {
        position: 'top-right',
        autoClose: timeToClose,
        hideProgressBar: hideProgress,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    });
};

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    const [email, setEmail] = useState(location.state?.email || '');
    const [input, setInput] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isValid, setIsValid] = useState({
        password: {
            isValid: true,
            message: '',
        },
        confirmPassword: {
            isValid: true,
            message: '',
        },
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState({
        password: true,
        confirmPassword: true,
    });

    useEffect(() => {
        if (!location.state?.email) {
            notify("Haven't submited email yet! You'll be back right now!", 'error', false, 5000);
            setTimeout(() => {
                navigate('/');
            }, 6000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckValidInput = () => {
        let isValid = true;

        if (!input.password.trim() || input.password.includes(' ') || input.password.length < 8) {
            if (!input.password.trim())
                setIsValid((prev) => ({ ...prev, password: { isValid: false, message: 'Password must be required' } }));
            else if (input.password.includes(' '))
                setIsValid((prev) => ({
                    ...prev,
                    password: { isValid: false, message: 'Password must be not include white space' },
                }));
            else
                setIsValid((prev) => ({
                    ...prev,
                    password: { isValid: false, message: 'Password must have 8 characters' },
                }));
            isValid = false;
        }

        if (
            !input.confirmPassword.trim() ||
            input.confirmPassword.includes(' ') ||
            input.password !== input.confirmPassword ||
            input.confirmPassword.length < 8
        ) {
            if (!input.confirmPassword.trim())
                setIsValid((prev) => ({
                    ...prev,
                    confirmPassword: { isValid: false, message: 'Confirm Password must be required' },
                }));
            else if (input.confirmPassword.includes(' '))
                setIsValid((prev) => ({
                    ...prev,
                    confirmPassword: { isValid: false, message: 'Confirm Password must be not include white space' },
                }));
            else if (input.password !== input.confirmPassword)
                setIsValid((prev) => ({
                    ...prev,
                    confirmPassword: { isValid: false, message: 'Confirm Password must be the same with Password' },
                }));
            else
                setIsValid((prev) => ({
                    ...prev,
                    confirmPassword: { isValid: false, message: 'Confirm Password must have 8 characters' },
                }));
            isValid = false;
        }

        if (!isValid) return;

        setOpenDialog(true);
    };

    const handleResetPassword = async () => {
        try {
            const res = await resetPasswordFunction(email, input.password);

            if (res.error === 1) {
                notify(res.message, 'error', false)
                return
            }

            notify("Password has been changed!", "success", false, 3000)

            setTimeout(() => {
                navigate('/login')
            }, 4000)
        } catch (error) {
            notify('Server is broken :((', 'error', false);
            console.log('Something wrong in reset password at ResetPassword: ', error);
        }
    };

    return (
        <div className="py-20 w-full min-h-full flex flex-col justify-center items-center">
            <h1 className="mb-5 text-2xl font-bold text-base-5">Cyber and Gentle Restaurant</h1>
            <Box width="500px" sx={{ boxShadow: 3 }}>
                <Card sx={{ paddingBottom: '20px' }}>
                    <CardHeader
                        title={
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                style={{ fontWeight: 'bold', color: '#035772' }}
                            >
                                Reset Password
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                Fill the filed
                            </Typography>
                        }
                        style={{ textAlign: 'center' }}
                    />
                    <hr />
                    <CardContent className="flex flex-col justify-start items-center gap-5">
                        <TextField
                            label="Email"
                            size="small"
                            fullWidth
                            value={email || "Seem you haven't submit the email yet!"}
                            disabled
                        />
                        <TextField
                            label="New Password"
                            size="small"
                            fullWidth
                            value={input.password}
                            onChange={(e) => {
                                setInput((prev) => ({ ...prev, password: e.target.value }));
                                setIsValid((prev) => ({ ...prev, password: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.password.isValid}
                            helperText={isValid.password.message}
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
                        />
                        <TextField
                            label="Confirm Password"
                            size="small"
                            fullWidth
                            value={input.confirmPassword}
                            onChange={(e) => {
                                setInput((prev) => ({ ...prev, confirmPassword: e.target.value }));
                                setIsValid((prev) => ({ ...prev, confirmPassword: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.confirmPassword.isValid}
                            helperText={isValid.confirmPassword.message}
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
                        />
                    </CardContent>
                    <hr className="border-t-[0.5px] border-gray-400 text-ba" />
                    <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{ color: '#444D41', backgroundColor: '#BBC0B9' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ marginRight: '15px' }}
                            disabled={!email && true}
                            onClick={handleCheckValidInput}
                        >
                            Submit
                        </Button>
                    </CardActions>
                </Card>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                }}
                fullWidth
            >
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna reset the password?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="text"
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleResetPassword}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

export default ResetPassword;
