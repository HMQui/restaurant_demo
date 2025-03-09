import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Countdown from 'react-countdown';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import isValidEmail from '../../services/isValidEmail';
import { requestResetPassword, verifySecretCode } from '../../services/apis/authApis';

const notify = (text, type = 'success', hideProgress) => {
    toast[type](text, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: hideProgress,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    });
};

function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [isValid, setIsValid] = useState({
        email: { isValid: true, message: '' },
        secretCode: { isValid: true, message: '' },
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [countdownEnd, setCountdownEnd] = useState(null);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            if (!email.trim() || !isValidEmail(email)) {
                setIsValid((prev) => ({
                    ...prev,
                    email: {
                        isValid: false,
                        message: !email.trim() ? 'Email must be required!' : 'The email format is incorrect!',
                    },
                }));
                return;
            }
            notify('Wait a minute!', 'success', true);
            const res = await requestResetPassword(email);

            if (res.error) {
                setIsValid((prev) => ({ ...prev, email: { isValid: false, message: res.message } }));
                return;
            }

            setOpenDialog(true);
            setCountdownEnd(Date.now() + 5 * 60 * 1000); // Set countdown end time
            notify('We have sent the code to your email already!', 'success', false);
        } catch (error) {
            notify('Server is broken :((', 'error', false);
            console.log('Something wrong in sending email for reset password at ForgotPassword: ', error);
        }
    };

    const handleSubmitSecretCode = async () => {
        try {
            if (!secretCode.trim() || secretCode.length !== 6) {
                setIsValid((prev) => ({
                    ...prev,
                    secretCode: {
                        isValid: false,
                        message: !secretCode.trim()
                            ? 'Secret Code must be required!'
                            : 'Secret Code must have 6 characters!',
                    },
                }));
                return;
            }

            const res = await verifySecretCode(secretCode, email);

            if (res.error === 1) {
                setIsValid((prev) => ({ ...prev, secretCode: { isValid: false, message: res.message } }));
                return;
            }

            notify('You will be routed to Reset Password Page right now', 'success', false);

            setTimeout(() => {
                console.log("Navigating with email:", email);
                navigate('/reset-password', { state: { email: email } })
            }, 2000);
        } catch (error) {
            notify('Server is broken :((', 'error', false);
            console.log('Something wrong in sending email for reset password at ForgotPassword: ', error);
        }
    };

    const handleResendCode = async () => {
        try {
            if (!email.trim() || !isValidEmail(email)) {
                setIsValid((prev) => ({
                    ...prev,
                    email: {
                        isValid: false,
                        message: !email.trim() ? 'Email must be required!' : 'The email format is incorrect!',
                    },
                }));
                return;
            }
            notify('Wait a minute!', 'success', true);
            const res = await requestResetPassword(email);

            if (res.error) {
                setIsValid((prev) => ({ ...prev, email: { isValid: false, message: res.message } }));
                return;
            }

            setOpenDialog(true);
            setCountdownEnd(Date.now() + 5 * 60 * 1000); // Set countdown end time
            notify('We have sent the code to your email already!', 'success', false);
        } catch (error) {
            notify('Server is broken :((', 'error', false);
            console.log('Something wrong in sending email for reset password at ForgotPassword: ', error);
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
                                You Forgot Your Password
                                <SentimentDissatisfiedOutlinedIcon sx={{ marginLeft: '10px' }} />
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                Let us help you!
                            </Typography>
                        }
                        style={{ textAlign: 'center' }}
                    />
                    <hr />
                    <CardContent className="flex flex-col justify-start items-center gap-5">
                        <p>Please enter your email address to search for your account.</p>
                        <TextField
                            placeholder="Email"
                            size="small"
                            fullWidth
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsValid((prev) => ({ ...prev, email: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.email.isValid}
                            helperText={isValid.email.message}
                        />
                    </CardContent>
                    <hr className="border-t-[0.5px] border-gray-400 text-ba" />
                    <CardActions>
                        <form
                            onSubmit={handleSubmitEmail}
                            className="w-full py-5 mt-3 flex flex-row justify-end items-center gap-2"
                        >
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ color: '#444D41', backgroundColor: '#BBC0B9' }}
                            >
                                Cancel
                            </Button>
                            <Button variant="contained" sx={{ marginRight: '15px' }} type="submit">
                                Submit
                            </Button>
                        </form>
                    </CardActions>
                </Card>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setSecretCode('');
                }}
                fullWidth
            >
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>We&apos;ve sent a code to your email.</DialogContentText>
                    <TextField
                        fullWidth
                        size="small"
                        label="Reset Code"
                        value={secretCode}
                        onChange={(e) => {
                            setSecretCode(e.target.value);
                            setIsValid((prev) => ({ ...prev, secretCode: { isValid: true, message: '' } }));
                        }}
                        sx={{ margin: '10px 0' }}
                        error={!isValid.secretCode.isValid}
                        helperText={isValid.secretCode.message}
                    />

                    {/* Countdown Timer */}
                    <div className="mt-2 flex flex-row justify-center text-2xl gap-1">
                        <span>The code will expire in</span>
                        {countdownEnd && (
                            <Countdown
                                date={countdownEnd}
                                renderer={({ minutes, seconds, completed }) => {
                                    if (completed) {
                                        setOpenDialog(false);
                                        return <span>00:00</span>;
                                    } else {
                                        return (
                                            <span>
                                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                                            </span>
                                        );
                                    }
                                }}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <span className="text-sm hover:text-blue-400 cursor-pointer" onClick={handleResendCode}>
                        Don&apos;t recive email? Resend here!
                    </span>
                    <Button
                        variant="text"
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmitSecretCode}>
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

export default ForgotPassword;
