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

interface ArticleItem {
    _id: string;
    title: string;
    description: string;
    image: string;
    popular: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ArticleResponse {
    status: number;
    message: string;
    data: {
        docs: ArticleItem[];
        totalDocs: number;
        limit: number;
        totalPages: number;
        page: number;
        pagingCounter: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
    };
}

interface NewArticle {
    title: string;
    description: string;
    image: File | null;
    _id?: string;
}

const Article: React.FC = () => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newArticle, setNewArticle] = useState<NewArticle>({
        title: '',
        description: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        totalDocs: 0,
        limit: 10,
        totalPages: 1
    });

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchArticles = async (page: number = 1) => {
        const apiUrl = `${baseUrl}/api/v1/admin/Article/getArticle?search=&fromDate=&toDate=&page=${page}&limit=${pagination.limit}`;
        
        try {
            setLoading(true);
            const response = await fetch(apiUrl);
            const data: ArticleResponse = await response.json();
            
            if (data.status === 200) {
                setArticles(data.data.docs);
                setPagination({
                    page: data.data.page,
                    totalDocs: data.data.totalDocs,
                    limit: data.data.limit,
                    totalPages: data.data.totalPages
                });
            } else {
                setError(data.message || 'Failed to fetch articles');
            }
        } catch (err) {
            setError('Error fetching articles');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteArticle = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/v1/admin/Article/deleteArticle/${id}`, {
                method: 'DELETE',
            });
            const data: { status: number; msg: string } = await response.json();
            
            if (data.msg === 'deleted') {
                setSuccessMessage('Article deleted successfully!');
                fetchArticles(pagination.page);
            } else {
                setError(data.msg || 'Failed to delete article');
            }
        } catch (err) {
            setError('Error deleting article');
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
            setSelectedItems(articles.map(article => article._id));
        } else {
            setSelectedItems([]);
        }
    };

    useEffect(() => {
        fetchArticles(pagination.page);
    }, [pagination.page]);

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setNewArticle(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleEditArticle = (article: ArticleItem) => {
        setIsEditMode(true);
        setNewArticle({
            _id: article._id,
            title: article.title,
            description: article.description,
            image: null
        });
        setPreviewImage(article.image);
        setOpenModal(true);
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setNewArticle({
            title: '',
            description: '',
            image: null
        });
        setPreviewImage('');
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!newArticle.title || !newArticle.description) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', newArticle.title);
            formData.append('description', newArticle.description);
            if (newArticle.image) {
                formData.append('image', newArticle.image);
            }

            let url = `${baseUrl}/api/v1/admin/Article/${isEditMode ? 'updateArticle/' + newArticle._id : 'createArticle'}`;
            let method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData,
            });

            const data: { status: number; message: string; data?: ArticleItem } = await response.json();

            if (data.status === 200) {
                setSuccessMessage(`Article ${isEditMode ? 'updated' : 'created'} successfully!`);
                setOpenModal(false);
                fetchArticles(pagination.page);
                handleCloseModal();
            } else {
                setError(data.message || `Failed to ${isEditMode ? 'update' : 'create'} article`);
            }
        } catch (err) {
            setError(`Error ${isEditMode ? 'updating' : 'creating'} article`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewArticle({
            title: '',
            description: '',
            image: null
        });
        setPreviewImage('');
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
                    Article
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
                        Add new article
                    </Button>
                </Box>
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="article-modal"
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
                        {isEditMode ? 'Edit Article' : 'Article'}
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

                    {/* Title Input */}
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                        sx={{ mb: 3 }}
                    />

                    {/* Description Input */}
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newArticle.description}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, description: e.target.value }))}
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

            {/* Article List */}
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
                        checked={selectedItems.length === articles.length && articles.length > 0}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < articles.length}
                        onChange={handleSelectAll}
                    />
                    <Typography>Image</Typography>
                    <Typography>Title</Typography>
                    <Typography>Description</Typography>
                    <Typography>Operations</Typography>
                </Box>

                {/* Article Items */}
                {articles.map((item) => (
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
                            src={item.image}
                            alt={item.title}
                            sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                        />
                        <Typography>{item.title}</Typography>
                        <Typography color="text.secondary" noWrap>
                            {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                onClick={() => handleEditArticle(item)}
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
                                onClick={() => handleDeleteArticle(item._id)}
                            >
                                DELETE
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>

            {/* Pagination */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of {pagination.totalDocs}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <IconButton 
                        onClick={handlePrevPage}
                        disabled={pagination.page === 1}
                        sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px 0 0 10px',
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            },
                            '&.Mui-disabled': {
                                borderColor: '#e0e0e0'
                            }
                        }}
                    >
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton 
                        onClick={handleNextPage}
                        disabled={pagination.page >= pagination.totalPages}
                        sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: '0 10px 10px 0',
                            borderLeft: 'none',
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            },
                            '&.Mui-disabled': {
                                borderColor: '#e0e0e0'
                            }
                        }}
                    >
                        <NavigateNextIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Article;
