import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  Collapse,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/' },
  { text: 'Article', icon: <ArticleOutlinedIcon />, path: '/article' },
  { text: 'Auto dealership', icon: <CachedOutlinedIcon />, path: '/auto-dealership' },
  { 
    text: 'Blog', 
    icon: <RssFeedOutlinedIcon />, 
    path: '/blog',
    subItems: [
      { text: 'Blog Category', path: '/blog/category' },
      { text: 'Page Blog', path: '/blog/page' }
    ]
  },
  { 
    text: 'Career', 
    icon: <WorkOutlinedIcon />, 
    path: '/career',
    subItems: [
      { text: 'Career', path: '/career/main' },
      { text: 'Openings', path: '/career/openings' },
      { text: 'Category', path: '/career/category' }
    ]
  },
  { text: 'Country, state, city', icon: <LocationCityOutlinedIcon />, path: '/location' },
  { text: "FAQ's", icon: <HelpOutlinedIcon />, path: '/faqs' },
  { 
    text: 'Free shop news', 
    icon: <NewspaperOutlinedIcon />, 
    path: '/news',
    subItems: [
      { text: 'Free Shop News', path: '/news/main' },
      { text: 'Free Shop News Category', path: '/news/category' }
    ]
  },
  { 
    text: 'Help Center', 
    icon: <SupportOutlinedIcon />, 
    path: '/help',
    subItems: [
      { text: 'Category', path: '/help/category' },
      { text: 'Help Center Knowledge', path: '/help/knowledge' }
    ]
  },
  { 
    text: 'How it works', 
    icon: <SettingsOutlinedIcon />, 
    path: '/how-it-works',
    subItems: [
      { text: 'How it Works', path: '/how-it-works/main' },
      { text: 'Bottom How it Works', path: '/how-it-works/bottom' }
    ]
  },
  { 
    text: 'Jobs', 
    icon: <BusinessCenterOutlinedIcon />, 
    path: '/jobs',
    subItems: [
      { text: 'Service', path: '/jobs/service' },
      { text: 'Jobs', path: '/jobs/list' }
    ]
  },
  { 
    text: 'Press', 
    icon: <AnnouncementOutlinedIcon />, 
    path: '/press',
    subItems: [
      { text: 'News Category', path: '/press/category' },
      { text: 'Topic', path: '/press/topic' },
      { text: 'News', path: '/press/news' }
    ]
  },
  { 
    text: 'Product', 
    icon: <SecurityOutlinedIcon />, 
    path: '/product',
    subItems: [
      { text: 'Category', path: '/product/category' },
      { text: 'Sub Category', path: '/product/subcategory' },
      { text: 'Condition', path: '/product/condition' },
      { text: 'Product', path: '/product/list' }
    ]
  },
  { text: 'Privacy & Terms', icon: <GavelOutlinedIcon />, path: '/privacy-terms' },
  { text: 'Trust & safety', icon: <SecurityOutlinedIcon />, path: '/trust-safety' },
];

const LeftSideBar: React.FC = () => {
  const drawerWidth = 430;
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string>('');

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setSelectedItem(currentMenuItem.text);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (text: string, path: string, hasSubItems?: boolean) => {
    if (hasSubItems) {
      setOpenSubmenu(prevOpen => prevOpen === text ? '' : text);
    } else {
      setSelectedItem(text);
      setOpenSubmenu(''); // Close any open submenu when navigating
      navigate(path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          paddingLeft: '130px',
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box sx={{
        overflow: 'auto',
        mt: 2,
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img src="assets/Logo.png" alt="Free Shops" style={{ width: '50px', height: '50px' }} />
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedItem === item.text}
                  onClick={() => handleMenuItemClick(item.text, item.path, !!item.subItems)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#199FB1',
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: '#199FB1',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                      '& .MuiTypography-root': {
                        color: '#fff',
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#199FB1',
                      borderRadius: '10px',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                      '& .MuiTypography-root': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{
                    color: selectedItem === item.text ? '#fff' : 'text.primary',
                    minWidth: '45px'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      style: {
                        fontSize: '0.95rem',
                        fontWeight: selectedItem === item.text ? 600 : 500
                      }
                    }}
                  />
                  {item.subItems && (
                    openSubmenu === item.text ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        onClick={() => {
                          setSelectedItem(subItem.text);
                          navigate(subItem.path);
                        }}
                        sx={{
                          pl: 7,
                          '&:hover': {
                            backgroundColor: '#199FB1',
                            borderRadius: '10px',
                            '& .MuiTypography-root': {
                              color: '#fff',
                            },
                          },
                        }}
                      >
                        <ListItemText 
                          primary={subItem.text}
                          primaryTypographyProps={{
                            style: {
                              fontSize: '0.9rem',
                            }
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default LeftSideBar;