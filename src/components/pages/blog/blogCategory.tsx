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

interface BlogCategoryItem {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface BlogCategoryResponse {
    status: number;
    message: string;
    data: {
        docs: BlogCategoryItem[];
        totalDocs: number;
        limit: number;
        totalPages: number;
        page: number;
        pagingCounter: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
    };
}

interface NewBlogCategory {
    title: string;
    description: string;
    _id?: string;
}

const BlogCategory: React.FC = () => {
    const [BlogCategorys, setBlogCategorys] = useState<BlogCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newBlogCategory, setNewBlogCategory] = useState<NewBlogCategory>({
        title: '',
        description: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchBlogCategorys = async (page: number = 1) => {
        if (!baseUrl) {
            setError('Base URL is not configured');
            setLoading(false);
            return;
        }

        const apiUrl = `${baseUrl}/api/v1/admin/BlogCategory/allBlogCategory`;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Handle the response data
            if (Array.isArray(data)) {
                setBlogCategorys(data);
            } else if (typeof data === 'object' && data !== null) {
                // If single object is returned, wrap it in an array
                if (data._id && data.title && data.description) {
                    setBlogCategorys([data]);
                } else if (Array.isArray(data.data)) {
                    setBlogCategorys(data.data);
                } else if (data.data && Array.isArray(data.data.docs)) {
                    setBlogCategorys(data.data.docs);
                } else {
                    setError('No blog categories found');
                    setBlogCategorys([]);
                }
            } else {
                setError('No blog categories found');
                setBlogCategorys([]);
            }
        } catch (err) {
            setError('Error fetching BlogCategorys');
            setBlogCategorys([]); // Reset to empty array on error
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogCategorys();
    }, []);

    const handleDeleteBlogCategory = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/v1/admin/BlogCategory/deleteBlogCategory/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            
            if (response.ok && data.status === 200) {
                setSuccessMessage('BlogCategory deleted successfully!');
                // Clear the selected items if the deleted item was selected
                setSelectedItems(prev => prev.filter(itemId => itemId !== id));
                // Immediately refetch the updated list
                await fetchBlogCategorys();
            } else {
                setError(data.message || 'Failed to delete BlogCategory');
                console.error('Delete failed:', data);
            }
        } catch (err) {
            setError('Error deleting BlogCategory');
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
            setSelectedItems(BlogCategorys.map(BlogCategory => BlogCategory._id));
        } else {
            setSelectedItems([]);
        }
    };


    const handleEditBlogCategory = (BlogCategory: BlogCategoryItem) => {
        setIsEditMode(true);
        setNewBlogCategory({
            _id: BlogCategory._id,
            title: BlogCategory.title,
            description: BlogCategory.description,
        });

        setOpenModal(true);
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setNewBlogCategory({
            title: '',
            description: '',
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!newBlogCategory.title || !newBlogCategory.description) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);

            // Create the request body as a regular object instead of FormData
            const requestBody = {
                title: newBlogCategory.title,
                description: newBlogCategory.description
            };

            let url = `${baseUrl}/api/v1/admin/BlogCategory/${isEditMode ? 'updateBlogCategory/' + newBlogCategory._id : 'addBlogCategory'}`;
            let method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data: { status: number; message: string; data?: BlogCategoryItem } = await response.json();

            if (response.ok && data.status === 200) {
                setSuccessMessage(`BlogCategory ${isEditMode ? 'updated' : 'created'} successfully!`);
                setOpenModal(false);
                fetchBlogCategorys();
                handleCloseModal();
            } else {
                setError(data.message || `Failed to ${isEditMode ? 'update' : 'create'} BlogCategory`);
                console.error('Server response:', data);
            }
        } catch (err) {
            setError(`Error ${isEditMode ? 'updating' : 'creating'} BlogCategory`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewBlogCategory({
            title: '',
            description: ''
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
                    BlogCategory
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
                            cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
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
                        Add new BlogCategory
                    </Button>
                </Box>
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="BlogCategory-modal"
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
                        {isEditMode ? 'Edit BlogCategory' : 'BlogCategory'}
                    </Typography>


                    {/* Title Input */}
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        value={newBlogCategory.title}
                        onChange={(e) => setNewBlogCategory(prev => ({ ...prev, title: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {/* Description Input */}
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newBlogCategory.description}
                        onChange={(e) => setNewBlogCategory(prev => ({ ...prev, description: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {/* Image Upload */}
                    <Box sx={{ mb: 3 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="blog-category-image"
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setNewBlogCategory(prev => ({ ...prev, image: file }));
                                }
                            }}
                        />

                    </Box>

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

            {/* BlogCategory List */}
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
                        checked={selectedItems.length === BlogCategorys.length && BlogCategorys.length > 0}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < BlogCategorys.length}
                        onChange={handleSelectAll}
                    />
                    <Typography fontWeight="bold">Title</Typography>
                    <Typography fontWeight="bold">Description</Typography>
                    <Typography fontWeight="bold">Actions</Typography>
                </Box>

                {/* BlogCategory Items */}
                {BlogCategorys.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">No blog categories found</Typography>
                    </Box>
                ) : (
                    BlogCategorys.map((item) => (
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
                                '&:hover': {
                                    bgcolor: '#f5f5f5',
                                },
                            }}
                        >
                            <Checkbox
                                size="small"
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                            />
                            <Typography>{item.title}</Typography>
                            <Typography color="text.secondary" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    onClick={() => handleEditBlogCategory(item)}
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
                                    onClick={() => handleDeleteBlogCategory(item._id)}
                                >
                                    DELETE
                                </Button>
                            </Box>
                        </Box>
                    ))
                )}
            </Paper>

            {/* Confirmation Snackbar for bulk delete */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    Are you sure you want to delete {selectedItems.length} items?
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Button size="small" color="error" variant="contained" onClick={async () => {
                            setLoading(true);
                            try {
                                // Delete all selected items sequentially
                                for (const id of selectedItems) {
                                    await handleDeleteBlogCategory(id);
                                }
                                setSelectedItems([]);
                                setOpenSnackbar(false);
                                // Final refetch to ensure list is up to date
                                await fetchBlogCategorys();
                            } catch (err) {
                                console.error('Bulk delete error:', err);
                                setError('Error during bulk delete');
                            } finally {
                                setLoading(false);
                            }
                        }}>
                            Delete
                        </Button>
                        <Button size="small" variant="outlined" onClick={handleCloseSnackbar}>
                            Cancel
                        </Button>
                    </Box>
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default BlogCategory;
