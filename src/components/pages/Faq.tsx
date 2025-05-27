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

interface FaqItem {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface FaqResponse {
    status: number;
    message: string;
    data: FaqItem[];
}

interface NewFaq {
    question: string;
    answer: string;
    _id?: string;
}

const Faq: React.FC = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newFaq, setNewFaq] = useState<NewFaq>({
        question: '',
        answer: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarAction, setSnackbarAction] = useState<(() => void) | null>(null);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchFaqs = async () => {
        const apiUrl = `${baseUrl}/api/v1/faq/all`;
        
        try {
            setLoading(true);
            const response = await fetch(apiUrl);
            const data: FaqResponse = await response.json();
            
            if (data.status === 200) {
                setFaqs(data.data);
            } else {
                setError(data.message || 'Failed to fetch FAQs');
            }
        } catch (err) {
            setError('Error fetching FAQs');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFaq = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/v1/faq/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            
            if (data.status === 200) {
                setSuccessMessage('FAQ deleted successfully!');
                fetchFaqs();
            } else {
                setError(data.message || 'Failed to delete FAQ');
            }
        } catch (err) {
            setError('Error deleting FAQ');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        setSnackbarMessage(`Are you sure you want to delete ${selectedItems.length} item(s)?`);
        setSnackbarAction(() => performBulkDelete);
        setOpenSnackbar(true);
    };

    const performBulkDelete = async () => {
        try {
            setLoading(true);
            const deletePromises = selectedItems.map(id => 
                fetch(`${baseUrl}/api/v1/faq/delete/${id}`, {
                    method: 'DELETE',
                })
            );
            
            await Promise.all(deletePromises);
            setSuccessMessage('Selected FAQs deleted successfully!');
            setSelectedItems([]);
            fetchFaqs();
        } catch (err) {
            setError('Error deleting FAQs');
            console.error('Error:', err);
        } finally {
            setLoading(false);
            setOpenSnackbar(false);
        }
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setSnackbarAction(null);
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
            setSelectedItems(faqs.map(faq => faq._id));
        } else {
            setSelectedItems([]);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleEditFaq = (faq: FaqItem) => {
        setIsEditMode(true);
        setNewFaq({
            _id: faq._id,
            question: faq.question,
            answer: faq.answer
        });
        setOpenModal(true);
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setNewFaq({
            question: '',
            answer: ''
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!newFaq.question || !newFaq.answer) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const url = `${baseUrl}/api/v1/faq/${isEditMode ? 'update/' + newFaq._id : 'add'}`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: newFaq.question,
                    answer: newFaq.answer
                }),
            });

            const data = await response.json();

            if (data.status === 200) {
                setSuccessMessage(`FAQ ${isEditMode ? 'updated' : 'created'} successfully!`);
                setOpenModal(false);
                fetchFaqs();
                handleCloseModal();
            } else {
                setError(data.message || `Failed to ${isEditMode ? 'update' : 'create'} FAQ`);
            }
        } catch (err) {
            setError(`Error ${isEditMode ? 'updating' : 'creating'} FAQ`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewFaq({
            question: '',
            answer: ''
        });
        setError(null);
        setIsEditMode(false);
    };

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
                    FAQ
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
                        onClick={handleAddNew}
                        sx={{
                            backgroundColor: '#199FB1',
                            '&:hover': {
                                backgroundColor: '#167d8c',
                            },
                        }}
                    >
                        Add new FAQ
                    </Button>
                </Box>
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="faq-modal"
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
                        {isEditMode ? 'Edit FAQ' : 'FAQ'}
                    </Typography>

                    {/* Question Input */}
                    <TextField
                        required
                        fullWidth
                        label="Question"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {/* Answer Input */}
                    <TextField
                        required
                        fullWidth
                        label="Answer"
                        multiline
                        rows={4}
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
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

            {/* Confirmation Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity="warning" 
                    action={
                        snackbarAction && (
                            <>
                                <Button color="inherit" size="small" onClick={snackbarAction}>
                                    CONFIRM
                                </Button>
                                <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                                    CANCEL
                                </Button>
                            </>
                        )
                    }
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

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

            {/* FAQ List */}
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Table Header */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 2fr 150px',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    bgcolor: '#f5f5f5'
                }}>
                    <Checkbox 
                        size="small" 
                        checked={selectedItems.length === faqs.length && faqs.length > 0}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < faqs.length}
                        onChange={handleSelectAll}
                    />
                    <Typography>Question</Typography>
                    <Typography>Answer</Typography>
                    <Typography>Operations</Typography>
                </Box>

                {/* FAQ Items */}
                {faqs.map((item) => (
                    <Box
                        key={item._id}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '50px 1fr 2fr 150px',
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
                        <Typography>{item.question}</Typography>
                        <Typography color="text.secondary" noWrap>
                            {item.answer}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                onClick={() => handleEditFaq(item)}
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
                                onClick={() => handleDeleteFaq(item._id)}
                            >
                                DELETE
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default Faq;
