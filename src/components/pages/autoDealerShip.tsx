import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Checkbox,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    Modal,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

interface DataItem {
    description: string;
    image?: string;
    _id: string;
}

interface EveryThingItem {
    name: string;
    description: string;
    image?: string;
    _id: string;
}

interface AutoDealerShipItem {
    _id: string;
    data: DataItem[];
    everyThing: EveryThingItem[];
    promotedPlacement: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface AutoDealerShipResponse {
    message: string;
    status: number;
    data: AutoDealerShipItem[];
}

interface NewDealerShip {
    name: string;
    description: string;
    image: File | null;
}

const AutoDealerShip: React.FC = () => {
    const [dealerShipData, setDealerShipData] = useState<AutoDealerShipItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [comingSoonSnackbar, setComingSoonSnackbar] = useState(false);
    const [newDealerShip, setNewDealerShip] = useState<NewDealerShip>({
        name: '',
        description: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState('');

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchDealerShips = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/v1/admin/AutoDealerShip/allAutoDealerShip`);
            const data: AutoDealerShipResponse = await response.json();
            
            if (data.status === 200) {
                setDealerShipData(data.data);
            } else {
                setError(data.message || 'Failed to fetch auto dealerships');
            }
        } catch (err) {
            setError('Error fetching auto dealerships');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedItems(dealerShipData.map(dealership => dealership._id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleEditClick = () => {
        setComingSoonSnackbar(true);
    };

    const handleDeleteClick = () => {
        setComingSoonSnackbar(true);
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setNewDealerShip({
            name: '',
            description: '',
            image: null
        });
        setPreviewImage('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setError(null);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewDealerShip(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setComingSoonSnackbar(true);
        setOpenModal(false);
        setError(null);
    };

    useEffect(() => {
        fetchDealerShips();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, color: 'error.main' }}>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    Auto Dealership
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            p: 0,
                            minWidth: '40px',
                            width: '40px',
                            height: '40px',
                            bgcolor: '#ffe8e8',
                            color: '#ff4d4d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0,
                            '&:hover': {
                                backgroundColor: '#ff3333',
                            },
                            cursor: selectedItems.length === 0? 'not-allowed' : 'pointer',
                        }}
                        onClick={handleBulkDelete}
                    >
                        <DeleteOutlineIcon />
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenModal}
                        sx={{
                            backgroundColor: '#199FB1',
                            '&:hover': {
                                backgroundColor: '#167d8c',
                            },
                        }}
                    >
                        Add new dealership
                    </Button>
                </Box>
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="dealership-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    position: 'relative',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    width: '100%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                }}>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" component="h2" mb={3}>
                        {isEditMode ? 'Edit Auto Dealership' : 'Add New Dealership'}
                    </Typography>

                    {/* Image Upload */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            cursor: 'pointer',
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                bgcolor: '#E1E1E1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                ...(previewImage && {
                                    backgroundImage: `url(${previewImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                })
                            }}
                        >
                            {!previewImage && (
                                <CameraAltOutlinedIcon sx={{ fontSize: 32, color: '#999' }} />
                            )}
                        </Box>
                        <Typography 
                            sx={{ 
                                color: '#1976d2',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            Upload Image
                        </Typography>
                    </Box>

                    {/* Name Input */}
                    <TextField
                        required
                        fullWidth
                        label="Name"
                        value={newDealerShip.name}
                        onChange={(e) => setNewDealerShip(prev => ({ ...prev, name: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {/* Description Input */}
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newDealerShip.description}
                        onChange={(e) => setNewDealerShip(prev => ({ ...prev, description: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            bgcolor: '#199FB1',
                            '&:hover': {
                                bgcolor: '#167d8c',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Save')}
                    </Button>
                </Box>
            </Modal>

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Coming Soon Snackbar */}
            <Snackbar
                open={comingSoonSnackbar}
                autoHideDuration={3000}
                onClose={() => setComingSoonSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setComingSoonSnackbar(false)} severity="info" sx={{ width: '100%' }}>
                    This feature is coming soon!
                </Alert>
            </Snackbar>

            {/* Dealership List */}
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Table Header */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '50px 100px 1fr 2fr 150px',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    bgcolor: '#f5f5f5'
                }}>
                    <Checkbox 
                        size="small" 
                        checked={selectedItems.length === dealerShipData.length && dealerShipData.length > 0}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < dealerShipData.length}
                        onChange={handleSelectAll}
                    />
                    <Typography>Image</Typography>
                    <Typography>Name</Typography>
                    <Typography>Description</Typography>
                    <Typography>Operations</Typography>
                </Box>

                {/* Dealership Items */}
                {dealerShipData.map((dealership) => (
                    dealership.everyThing.map((item) => (
                        <Box
                            key={item._id}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '50px 100px 1fr 2fr 150px',
                                alignItems: 'center',
                                p: 2,
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                '&:last-child': {
                                    borderBottom: 'none',
                                },
                            }}
                        >
                            <Checkbox 
                                size="small" 
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                            />
                            <Box
                                component="img"
                                src={item.image || 'placeholder-image-url'}
                                alt={item.name}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                }}
                            />
                            <Typography>{item.name}</Typography>
                            <Typography color="text.secondary" noWrap>
                                {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    onClick={handleEditClick}
                                    sx={{
                                        bgcolor: '#e8f4f5',
                                        color: '#199FB1',
                                        '&:hover': { bgcolor: '#d1ebed' },
                                    }}
                                >
                                    EDIT
                                </Button>
                                <Button
                                    size="small"
                                    sx={{
                                        bgcolor: '#ffe8e8',
                                        color: '#ff4d4d',
                                        '&:hover': { bgcolor: '#ffd1d1' },
                                    }}
                                    onClick={handleDeleteClick}
                                >
                                    DELETE
                                </Button>
                            </Box>
                        </Box>
                    ))
                ))}
            </Paper>
        </Box>
    );
};

export default AutoDealerShip;
