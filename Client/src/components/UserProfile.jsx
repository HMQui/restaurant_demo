import { useEffect, useRef, useState } from 'react';
import { userInfoFull } from '../../services/apis/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    IconButton,
    TextField,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined, Save } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import authAction from '../../store/actions/authAction';
import typesAction from '../../store/actions/typesAction';
import infoUserAction from '../../store/actions/infoUserAction';
import isValidEmail from '../../services/isValidEmail';
import { logOut } from '../../services/apis/authApis';
import {
    updateUserProfile,
    changePassword as changePasswordFunction,
    handleUploadAvatar,
} from '../../services/apis/userApi.js';
import NoAvatar from '../assets/images/NoAvatar.png';

const notify = (text, type = 'success') => {
    toast[type](text, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    });
};

function UserProfile() {
    const avatarInputRef = useRef();
    const role = useSelector((state) => state.infoUser.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const [currUserName, setCurrUserName] = useState('');
    const [profile, setProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState({
        saveChange: false,
        logOut: false,
        changePassword: false,
        defaultAvatar: false,
    });
    const [validField, setValidField] = useState({
        username: false,
        email: false,
        fullname: false,
    });
    const [changePassword, setChangePassword] = useState({
        currPass: '',
        newPass: '',
        confirmPass: '',
    });
    const [visibleChangePassword, setVisibleChangePassword] = useState({
        currPass: false,
        newPass: false,
        confirmPass: false,
    });
    const [validChangePass, setValidChangePass] = useState({
        currPass: {
            valid: true,
            mess: '',
        },
        newPass: {
            valid: true,
            mess: '',
        },
        confirmPass: {
            valid: true,
            mess: '',
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userInfoFull();
                setCurrUserName(data.username);
                setProfile(data);
                setProfile({
                    ...data,
                    dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
                });
            } catch (error) {
                console.log('Something went wrong while fetching user info:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const handleChangeProfile = (key, value) => {
        setProfile((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleUpdateProfile = async () => {
        let isValid = true;

        if (profile.email !== null && profile.email !== '' && !isValidEmail(profile.email)) {
            setValidField((prev) => ({ ...prev, email: true }));
            isValid = false;
        }

        if (profile.username.trim() === '') {
            setValidField((prev) => ({ ...prev, username: true }));
            isValid = false;
        }

        if (profile.fullname.trim() === '') {
            setValidField((prev) => ({ ...prev, fullname: true }));
            isValid = false;
        }

        if (!isValid) return;

        try {
            const newData = await updateUserProfile(profile, avatar);
            if (!newData || !newData.updatedUser) {
                throw new Error('Invalid response from server');
            }

            notify('Your profile has been updated!');
            setProfile(newData.updatedUser);
        } catch (error) {
            notify('Something is broken - Your profile can not be updated!', 'error');
            console.log('Update Profile fail: ', error);
        }
    };

    const handleLogOut = async () => {
        try {
            await logOut();
            dispatch(authAction(typesAction.LOGOUT));
            dispatch(infoUserAction());
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/');
        }
    };

    const handleChangePassword = async () => {
        let isValid = true;
        // Check valid currPass
        if (!changePassword.currPass.trim() || changePassword.currPass.length < 8) {
            if (!changePassword.currPass.trim()) {
                setValidChangePass((prev) => ({
                    ...prev,
                    currPass: { valid: false, mess: 'Current Password must be required!' },
                }));
            } else {
                setValidChangePass((prev) => ({
                    ...prev,
                    currPass: { valid: false, mess: 'Current Password must has more than 8 characters' },
                }));
            }

            isValid = false;
        }
        // Check valid newPass
        if (!changePassword.newPass.trim() || changePassword.newPass.length < 8) {
            if (!changePassword.newPass.trim()) {
                setValidChangePass((prev) => ({
                    ...prev,
                    newPass: { valid: false, mess: 'New Password must be required!' },
                }));
            } else {
                setValidChangePass((prev) => ({
                    ...prev,
                    newPass: { valid: false, mess: 'New Password must has more than 8 characters' },
                }));
            }
            isValid = false;
        }

        // Check valid confirmPass
        if (
            !changePassword.confirmPass.trim() ||
            changePassword.newPass.length < 8 ||
            changePassword.newPass !== changePassword.confirmPass
        ) {
            if (!changePassword.confirmPass.trim())
                setValidChangePass((prev) => ({
                    ...prev,
                    confirmPass: { valid: false, mess: 'Confirm Password must be required!' },
                }));
            else if (changePassword.newPass.length < 8)
                setValidChangePass((prev) => ({
                    ...prev,
                    confirmPass: { valid: false, mess: 'Confirm Password has more than 8 characters' },
                }));
            else
                setValidChangePass((prev) => ({
                    ...prev,
                    confirmPass: { valid: false, mess: 'Confirm Password must be same with New Password' },
                }));
            isValid = false;
        }

        if (!isValid) return;
        try {
            const res = await changePasswordFunction(changePassword.currPass, changePassword.newPass);

            if (!res) throw new Error('Server is broken!');

            if (res.error === 1) {
                setValidChangePass((prev) => ({ ...prev, currPass: { valid: false, mess: res.message } }));
                return;
            }

            notify('Password has been changed!');
            setOpenDialog((prev) => ({
                ...prev,
                changePassword: false,
            }));
            setChangePassword({
                currPass: '',
                newPass: '',
                confirmPass: '',
            });
            setVisibleChangePassword({ currPass: false, newPass: false, confirmPass: false });
        } catch (error) {
            notify('Something is broken - Your Password can not be updated!', 'error');
            console.log('Something wrong at Change Password in UserProfile page: ' + error);
        }
    };

    const handleUpdateAvatar = async () => {
        if (!avatar) {
            notify('You have not supplied any files yet!', 'error');
            return;
        }
        try {
            const res = await handleUploadAvatar(avatar);

            if (!res) throw new Error('Server is broken - Avatar updating');

            // reset profile
            setProfile((prev) => ({ ...prev, avatar: res.secure_url }));

            setAvatar(null);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }

            // update state in infoUserAction
            dispatch(infoUserAction(typesAction.CHANGE_LOCAL_AVATAR, { role, avatar: res.secure_url }));

            notify('Avatar has been changed!');
        } catch (error) {
            notify('Something is broken - Your Avatar can not be updated!', 'error');
            console.log('Something wrong in Avatar update at UserProfile: ', error);
        }
    };

    const handleSetDefaultAvatar = async (formData) => {
        try {
            const res = await handleUploadAvatar(formData);

            if (!res) throw new Error('Server is broken - Avatar updating');

            // reset profile
            setProfile((prev) => ({ ...prev, avatar: null }));

            // update state in infoUserAction
            dispatch(infoUserAction(typesAction.CHANGE_LOCAL_AVATAR, { role, avatar: null }));

            notify('Avatar has been changed!');
        } catch (error) {
            notify('Something is broken - Your Avatar can not be updated!', 'error');
            console.log('Something wrong in Avatar update at UserProfile: ', error);
        }
    };

    return (
        <div className="w-full min-h-full bg-white flex flex-row justify-center items-center gap-20">
            <div className="min-w-3/5 h-fit flex flex-col justify-center gap-5">
                <div className="flex flex-row gap-5">
                    <img
                        src={profile.avatar ? `${profile.avatar}` : NoAvatar}
                        alt=""
                        className="w-24 h-24 rounded-full"
                    />
                    <div className="mt-4 flex flex-col">
                        <h2 className="font-bold text-2xl">{currUserName}</h2>
                        <h4>Joined: {profile.createdAt.split('T')[0]}</h4>
                        <span
                            className="mt-2 text-sm text-base-4 hover:text-accent-1 underline cursor-pointer"
                            onClick={() => setOpenDialog((prev) => ({ ...prev, defaultAvatar: true }))}
                        >
                            Set Avatar as Default?
                        </span>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-center gap-4 min-w-[450px]">
                        <TextField
                            error={validField.username}
                            helperText={validField.username && 'Username is required'}
                            fullWidth
                            value={profile.username}
                            label="Username"
                            size="small"
                            onChange={(e) => {
                                setValidField((prev) => ({
                                    ...prev,
                                    username: false,
                                }));
                                handleChangeProfile('username', e.target.value);
                            }}
                        />
                        <TextField
                            error={validField.fullname}
                            helperText={validField.fullname && 'Fullname is required'}
                            fullWidth
                            value={profile.fullname}
                            label="Fullname"
                            size="small"
                            onChange={(e) => {
                                setValidField((prev) => ({
                                    ...prev,
                                    fullname: false,
                                }));
                                handleChangeProfile('fullname', e.target.value);
                            }}
                        />
                        <TextField
                            disabled={profile.provider === 'google'}
                            error={validField.email}
                            helperText={validField.email && 'Invalid email format'}
                            fullWidth
                            value={profile.email}
                            label="Email"
                            size="small"
                            onChange={(e) => {
                                setValidField((prev) => ({
                                    ...prev,
                                    email: false,
                                }));
                                handleChangeProfile('email', e.target.value);
                            }}
                        />
                        <TextField
                            inputRef={avatarInputRef}
                            fullWidth
                            label="Avatar Upload File"
                            size="small"
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) {
                                    console.log('No file selected');
                                    return;
                                }

                                const formData = new FormData();
                                formData.append('image', file);

                                setAvatar(formData);
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleUpdateAvatar}>
                                        <Save />
                                    </IconButton>
                                ),
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField fullWidth value={profile.provider} label="Login with" size="small" disabled />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-2 min-w-[450px]">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Birth"
                                value={profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null}
                                onChange={(newValue) =>
                                    handleChangeProfile('dateOfBirth', newValue ? newValue.toISOString() : null)
                                }
                            />
                        </LocalizationProvider>

                        <FormControl>
                            <FormLabel>Sexual</FormLabel>
                            <RadioGroup
                                row
                                value={profile.sexual || 'unknown'}
                                onChange={(e) => handleChangeProfile('sexual', e.target.value)}
                            >
                                <FormControlLabel control={<Radio />} label="Male" value="male" />
                                <FormControlLabel control={<Radio />} label="Female" value="female" />
                                <FormControlLabel control={<Radio />} label="None" value="unknown" />
                            </RadioGroup>
                        </FormControl>
                        {profile.provider === 'local' && (
                            <span
                                className="text-sm text-accent-1 underline font-light select-none cursor-pointer"
                                onClick={() =>
                                    setOpenDialog((prev) => ({
                                        ...prev,
                                        changePassword: true,
                                    }))
                                }
                            >
                                Wanna change your Password?
                            </span>
                        )}

                        <div className="mt-1 flex flex-row gap-5">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDialog((prev) => ({ ...prev, logOut: true }))}
                            >
                                Log Out
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenDialog((prev) => ({ ...prev, saveChange: true }))}
                            >
                                Save changes
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Save change Dialog */}
                <Dialog
                    open={openDialog.saveChange}
                    onClose={() => setOpenDialog((prev) => ({ ...prev, saveChange: false }))}
                    fullWidth
                >
                    <DialogTitle>Save change</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Do you want to save your profile?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                await handleUpdateProfile();
                                setOpenDialog((prev) => ({ ...prev, saveChange: false }));
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => setOpenDialog((prev) => ({ ...prev, saveChange: false }))}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Log out Dialog */}
                <Dialog
                    open={openDialog.logOut}
                    onClose={() => setOpenDialog((prev) => ({ ...prev, logOut: false }))}
                    fullWidth
                >
                    <DialogTitle>Save change</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Do you want to LOG OUT?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                                setOpenDialog((prev) => ({ ...prev, logOut: false }));
                                await handleLogOut();
                            }}
                        >
                            Log Out
                        </Button>
                        <Button variant="text" onClick={() => setOpenDialog((prev) => ({ ...prev, logOut: false }))}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Change Password Dialog */}
                <Dialog
                    open={openDialog.changePassword}
                    onClose={() => setOpenDialog((prev) => ({ ...prev, changePassword: false }))}
                    fullWidth
                >
                    <DialogTitle>Change Your Password</DialogTitle>
                    <DialogContent>
                        <div className="py-5 flex flex-col gap-4">
                            <TextField
                                size="small"
                                fullWidth
                                label="Your Current Password"
                                value={changePassword.currPass}
                                error={!validChangePass.currPass.valid}
                                helperText={validChangePass.currPass.mess}
                                onChange={(e) => {
                                    setChangePassword((prev) => ({ ...prev, currPass: e.target.value }));
                                    setValidChangePass((prev) => ({
                                        ...prev,
                                        currPass: {
                                            valid: true,
                                            mess: '',
                                        },
                                    }));
                                }}
                                type={!visibleChangePassword.currPass ? 'password' : 'text'}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            disableRipple
                                            onClick={() =>
                                                setVisibleChangePassword((prev) => ({
                                                    ...prev,
                                                    currPass: !prev.currPass,
                                                }))
                                            }
                                        >
                                            {visibleChangePassword.currPass ? (
                                                <VisibilityOutlined />
                                            ) : (
                                                <VisibilityOffOutlined />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                size="small"
                                fullWidth
                                label="Your New Password"
                                value={changePassword.newPass}
                                error={!validChangePass.newPass.valid}
                                helperText={validChangePass.newPass.mess}
                                onChange={(e) => {
                                    setChangePassword((prev) => ({ ...prev, newPass: e.target.value }));
                                    setValidChangePass((prev) => ({
                                        ...prev,
                                        newPass: {
                                            valid: true,
                                            mess: '',
                                        },
                                    }));
                                }}
                                type={!visibleChangePassword.newPass ? 'password' : 'text'}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            disableRipple
                                            onClick={() =>
                                                setVisibleChangePassword((prev) => ({
                                                    ...prev,
                                                    newPass: !prev.newPass,
                                                }))
                                            }
                                        >
                                            {visibleChangePassword.newPass ? (
                                                <VisibilityOutlined />
                                            ) : (
                                                <VisibilityOffOutlined />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                size="small"
                                fullWidth
                                label="Confirm Password"
                                value={changePassword.confirmPass}
                                error={!validChangePass.confirmPass.valid}
                                helperText={validChangePass.confirmPass.mess}
                                onChange={(e) => {
                                    setChangePassword((prev) => ({ ...prev, confirmPass: e.target.value }));
                                    setValidChangePass((prev) => ({
                                        ...prev,
                                        confirmPass: {
                                            valid: true,
                                            mess: '',
                                        },
                                    }));
                                }}
                                type={!visibleChangePassword.confirmPass ? 'password' : 'text'}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            disableRipple
                                            onClick={() =>
                                                setVisibleChangePassword((prev) => ({
                                                    ...prev,
                                                    confirmPass: !prev.confirmPass,
                                                }))
                                            }
                                        >
                                            {visibleChangePassword.confirmPass ? (
                                                <VisibilityOutlined />
                                            ) : (
                                                <VisibilityOffOutlined />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                // setOpenDialog((prev) => ({ ...prev, changePassword: false }));
                                await handleChangePassword();
                            }}
                        >
                            Change
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                setOpenDialog((prev) => ({ ...prev, changePassword: false }));
                                setChangePassword({
                                    currPass: '',
                                    newPass: '',
                                    confirmPass: '',
                                });
                                setVisibleChangePassword({ currPass: false, newPass: false, confirmPass: false });
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Default Avatar Dialog */}
                <Dialog
                    open={openDialog.defaultAvatar}
                    onClose={() => setOpenDialog((prev) => ({ ...prev, defaultAvatar: false }))}
                    fullWidth
                >
                    <DialogTitle>Set Default Avatar</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Do you want to SET AVATAR as DEFAULT?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                setOpenDialog((prev) => ({ ...prev, defaultAvatar: false }));
                                const formData = new FormData();

                                formData.append('isDefault', 'true');
                                await handleSetDefaultAvatar(formData);
                            }}
                        >
                            Change
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => setOpenDialog((prev) => ({ ...prev, defaultAvatar: false }))}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
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

export default UserProfile;
