// src/components/LoginForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store/store';
import {
    Button,
    TextField,
    Typography,
    Box,
    Paper,
    Checkbox,
    FormControlLabel,
    Link,
    Alert,
} from '@mui/material';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `url('assets/LoginBackground.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <img
                        src="assets/Logo.png"
                        alt="Free Shops Logo"
                        style={{ width: '60px', height: '60px', marginRight: '10px' }}
                    />
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Login to Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Please enter your email and password to continue
                        </Typography>
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Email address:
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@gmail.com"
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#f8f9fa',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Password</Typography>
                            <Link href="#" variant="body2" underline="hover" sx={{ color: 'text.secondary' }}>
                                Forget Password?
                            </Link>
                        </Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#f8f9fa',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                },
                            }}
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                color="primary"
                                disabled={isLoading}
                            />
                        }
                        label="Remember Password"
                        sx={{ mb: 2 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            backgroundColor: '#26A69A',
                            '&:hover': {
                                backgroundColor: '#00897B',
                            },
                        }}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginForm;
