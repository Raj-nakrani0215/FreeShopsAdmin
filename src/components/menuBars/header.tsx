import React, { useState } from 'react';
import { Box, InputBase, Badge, Avatar } from '@mui/material';
import { NotificationsOutlined, Search, KeyboardArrowDown } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import ProfileMenu from './ProfileMenu';

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#F5F6FA',
  borderRadius: '10px',
  border: '0.6px solid #E0E0E0',
  width: '400px',
  height: '38px',
  padding: '0 10px',
}));

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        height: '60px'
      }}
    >
      {/* Search Section */}
      <SearchBox>
        <Search sx={{ color: '#757575', marginRight: 1 }} />
        <InputBase
          placeholder="Search"
          sx={{ width: '100%' }}
        />
      </SearchBox>

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Notifications */}
        <Badge badgeContent={1} color="error">
          <NotificationsOutlined sx={{ color: '#757575' }} />
        </Badge>

        {/* User Profile */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            cursor: 'pointer',
            marginLeft: '70px'
          }}
          onClick={handleClick}
        >
          <Avatar
            src={user?.image || "/path-to-avatar.jpg"}
            alt={user?.fullName || "User"}
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Box sx={{ fontWeight: 500 }}>{user?.fullName || "User"}</Box>
            <Box sx={{ fontSize: '0.875rem', color: '#757575', display: 'flex', alignItems: 'center',justifyContent: 'space-between',gap:'10px' }}>
              {user?.userType || "Guest"}
              <Box sx={{color: '#757575', display: 'flex', alignItems: 'center',border:'1px solid #757575',borderRadius:'50%',padding:'0',margin:'0' }}>
              <KeyboardArrowDown sx={{ fontSize:'16px', color: '#757575', margin:'0', padding:'0' }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Profile Menu */}
        <ProfileMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        />
      </Box>
    </Box>
  );
};

export default Header;