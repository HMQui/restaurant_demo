import { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { createNewProduct } from '../../../../services/apis/productsApi';

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

function CreateNewProduct() {
    const [newProduct, setNewProduct] = useState({
        name: '',
        title: '',
        subTitle: '',
        price: '',
        category: '',
        image: '',
    });

    const [error, setError] = useState({
        name: { error: false, message: '' },
        title: { error: false, message: '' },
        subTitle: { error: false, message: '' },
        price: { error: false, message: '' },
        category: { error: false, message: '' },
        image: { error: false, message: '' },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => ({ ...prev, [name]: { error: false, message: '' } }));
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleSubmitData = (dataSubmit) => {
        const fetch = async () => {
            try {
                const res = await createNewProduct(dataSubmit);
                if (res.error === 1) {
                    return;
                }
                notify('Create new product successfully', 'success', false, 3000);
                setNewProduct({
                    name: '',
                    title: '',
                    subTitle: '',
                    price: '',
                    category: '',
                    image: '',
                });
            } catch (error) {
                console.log('Something wrong when submit new product', error);
                notify(error, 'error', false, 3000);
            }
        };

        fetch();
    };

    const handleCheckValidInput = () => {
        let isValid = true;

        if (!newProduct.name.trim()) {
            setError((prev) => ({ ...prev, name: { error: true, message: 'Name is required' } }));
            isValid = false;
        }

        if (!newProduct.title.trim()) {
            setError((prev) => ({ ...prev, title: { error: true, message: 'Title is required' } }));
            isValid = false;
        }

        if (!newProduct.subTitle.trim()) {
            setError((prev) => ({ ...prev, subTitle: { error: true, message: 'Subtitle is required' } }));
            isValid = false;
        }

        if (!newProduct.price.trim()) {
            setError((prev) => ({ ...prev, price: { error: true, message: 'Price is required' } }));
            isValid = false;
        }

        if (!newProduct.category.trim()) {
            setError((prev) => ({ ...prev, category: { error: true, message: 'Category is required' } }));
            isValid = false;
        }

        if (!isValid) {
            return;
        } else {
            setOpenDialog(true);
        }
    };

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <h1 className="text-3xl font-bold">Create New Product</h1>
            <div className="w-5/6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <TextField
                    size="small"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    error={error.name.error}
                    helperText={error.name.message}
                />
                <TextField
                    size="small"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    name="title"
                    value={newProduct.title}
                    onChange={handleChange}
                    error={error.title.error}
                    helperText={error.title.message}
                />
                <TextField
                    size="small"
                    label="Sub Title"
                    variant="outlined"
                    fullWidth
                    name="subTitle"
                    value={newProduct.subTitle}
                    onChange={handleChange}
                    error={error.subTitle.error}
                    helperText={error.subTitle.message}
                />
                <TextField
                    size="small"
                    label="Price"
                    variant="outlined"
                    type="number"
                    fullWidth
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    error={error.price.error}
                    helperText={error.price.message}
                />
                <TextField
                    size="small"
                    label="Category"
                    variant="outlined"
                    fullWidth
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    error={error.category.error}
                    helperText={error.category.message}
                />
                <TextField
                    size="small"
                    label="Image URL"
                    variant="outlined"
                    fullWidth
                    name="image"
                    value={newProduct.image}
                    onChange={handleChange}
                    error={error.image.error}
                    helperText={error.image.message}
                />
                <Button
                    variant="contained"
                    className="mt-4"
                    onClick={() => handleCheckValidInput()}
                    sx={{ width: '100px', marginRight: 'auto' }}
                >
                    Submit
                </Button>
            </div>
            {/* Dialog For SUBMIT NEW PRODUCT */}
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                }}
                fullWidth
            >
                <DialogTitle>Add a New Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna add this product?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleSubmitData(newProduct);
                            setOpenDialog(false);
                        }}
                    >
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

export default CreateNewProduct;
