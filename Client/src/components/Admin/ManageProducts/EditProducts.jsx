import { useState } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { updateProduct } from '../../../../services/apis/productsApi';

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

function EditProducts({ dataRender }) {
    const [valueInput, setValueInput] = useState(dataRender);
    const [openDialog, setOpenDialog] = useState(false);

    const duplicate = (obj1, obj2) => {
        return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValueInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeProduct = () => {
        const changedItems = Object.keys(dataRender).filter((key) => dataRender[key] !== valueInput[key]);

        let changeData = changedItems.map((item) => ({ [item]: valueInput[item] }));

        changeData = Object.assign({}, ...changeData);
        const fetch = async () => {
            try {
                const res = await updateProduct(valueInput.id, changeData);
                if (res.error === 1) {
                    notify('Can not update product right now', 'error', false, 3000);
                    setOpenDialog(false);
                    return;
                }
                notify('This product has been updated', 'success', false, 3000);
                setOpenDialog(false);
            } catch (error) {
                console.log(error);
                notify('Can not update product right now', 'error', false, 3000);
                setOpenDialog(false);
            }
        };

        fetch();
    };

    return (
        <div className="flex flex-row justify-between items-start mt-10 group gap-2">
            <div className="w-full flex flex-col justify-start items-start gap-2">
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.category}
                    onChange={handleChange}
                    name="category"
                    label="Category"
                />
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.name}
                    onChange={handleChange}
                    name="name"
                    label="Name"
                />
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.title}
                    onChange={handleChange}
                    name="title"
                    label="Title"
                />
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.subTitle}
                    onChange={handleChange}
                    name="subTitle"
                    label="Subtitle"
                />
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.image}
                    onChange={handleChange}
                    name="image"
                    label="Image URL"
                />
                <TextField
                    fullWidth
                    size="small"
                    value={valueInput.price}
                    onChange={handleChange}
                    name="price"
                    label="Price"
                />
            </div>
            <div className="h-full flex flex-col justify-between items-center">
                <LazyLoadImage
                    src={valueInput.image}
                    alt={valueInput.title}
                    effect="blur" // Làm mờ trước khi tải xong
                    className="w-[306px] h-[175px] object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {!duplicate(dataRender, valueInput) && (
                    <div className="flex flex-row gap-2">
                        <Button variant="text" onClick={() => setValueInput(dataRender)}>
                            Reset
                        </Button>
                        <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                            Change
                        </Button>
                    </div>
                )}
            </div>
            {/* Dialog confirm CHANGE PRODUCT */}
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                }}
                fullWidth
            >
                <DialogTitle>Change Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna this product?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleChangeProduct}>
                        Change
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

export default EditProducts;

EditProducts.propTypes = {
    dataRender: PropTypes.object,
};
