import React from 'react';
import { Menu, MenuItem, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import {
    ManageAccounts as ManageAccountsIcon,
    Key as KeyIcon,
    History as HistoryIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';

interface ProfileMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ anchorEl, open, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        onClose();
        navigate('/login');
    };

    const menuItems = [
        {
            icon: <ManageAccountsIcon sx={{ color: ' #4E96FF' }} />,
            text: 'Manage Account',
            onClick: onClose,
        },
        {
            icon: <KeyIcon sx={{ color: '#F97FD9' }} />,
            text: 'Change Password',
            onClick: onClose,
        },
        {
            icon: <HistoryIcon sx={{ color: '#9E8FFF' }} />,
            text: 'Activity Log',
            onClick: onClose,
        },
        {
            icon: <LogoutIcon sx={{ color: '#FF8F8F' }} />,
            text: 'Log out',
            onClick: handleLogout,
        },
    ];

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    mt: 1.5,
                    width: 220,
                    borderRadius: 2,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
            }}
            MenuListProps={{
                disablePadding: true,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {menuItems.map((item, index) => (
                <MenuItem
                    key={item.text}
                    onClick={item.onClick}
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {item.icon}
                        <Typography>{item.text}</Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>
    );
};

export default ProfileMenu; 