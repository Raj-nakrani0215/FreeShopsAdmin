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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// iconMap.ts
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
import menuJson from '../../menuItems.json';
export const iconMap: Record<string, any> = {
  DashboardOutlinedIcon: <DashboardOutlinedIcon />,
  ArticleOutlinedIcon: <ArticleOutlinedIcon />,
  CachedOutlinedIcon: <CachedOutlinedIcon />,
  RssFeedOutlinedIcon: <RssFeedOutlinedIcon />,
  WorkOutlinedIcon: <WorkOutlinedIcon />,
  LocationCityOutlinedIcon: <LocationCityOutlinedIcon />,
  HelpOutlinedIcon: <HelpOutlinedIcon />,
  NewspaperOutlinedIcon: <NewspaperOutlinedIcon />,
  SupportOutlinedIcon: <SupportOutlinedIcon />,
  SettingsOutlinedIcon: <SettingsOutlinedIcon />,
  BusinessCenterOutlinedIcon: <BusinessCenterOutlinedIcon />,
  AnnouncementOutlinedIcon: <AnnouncementOutlinedIcon />,
  SecurityOutlinedIcon: <SecurityOutlinedIcon />,
  GavelOutlinedIcon: <GavelOutlinedIcon />,
};


type SubItem = {
  text: string;
  path: string;
};

type MenuItem = {
  text: string;
  icon: string;
  path: string;
  subItems?: SubItem[];
};

const LeftSideBar: React.FC = () => {
  const drawerWidth = 430;
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string>('');

  const menuItems: MenuItem[] = menuJson;

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item =>
      item.path === currentPath ||
      item.subItems?.some(sub => sub.path === currentPath)
    );
    if (currentMenuItem) {
      setSelectedItem(currentPath);
      if (currentMenuItem.subItems) setOpenSubmenu(currentMenuItem.text);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.subItems) {
      setOpenSubmenu(prevOpen => prevOpen === item.text ? '' : item.text);
    } else {
      setSelectedItem(item.path);
      setOpenSubmenu('');
      navigate(item.path);
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
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'start', mb: 1 }}>
          <img src="assets/Logo.png" alt="Free Shops" style={{ width: '60px', height: '60px' }} />
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedItem === item.path}
                  onClick={() => handleMenuItemClick(item)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#199FB1',
                      borderRadius: '10px',
                      '& .MuiListItemIcon-root, & .MuiTypography-root': { color: '#fff' },
                      '& .MuiTypography-root': { fontWeight: 600 }
                    },
                    '&:hover': {
                      backgroundColor: '#199FB1',
                      borderRadius: '10px',
                      '& .MuiListItemIcon-root, & .MuiTypography-root': { color: '#fff' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '45px' }}>
                    {iconMap[item.icon] || null}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      style: {
                        fontSize: '0.95rem',
                        fontWeight: selectedItem === item.path ? 600 : 500
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
                          setSelectedItem(subItem.path);
                          navigate(subItem.path);
                        }}
                        selected={selectedItem === subItem.path}
                        sx={{
                          pl: 7,
                          '&.Mui-selected': {
                            backgroundColor: '#199FB1',
                            borderRadius: '10px',
                            '& .MuiTypography-root': {
                              color: '#fff',
                              fontWeight: 600
                            },
                          },
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
                          primaryTypographyProps={{ style: { fontSize: '0.9rem' } }}
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
