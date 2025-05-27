// src/components/LoginForm.tsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import SalesChart from './saleChart';
import RevenueChart from './revenueChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, change, icon, isPositive,bg }: any) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
              }}
            >
              {isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              {change}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${bg}`,
              borderRadius: '30%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const theme = useTheme();

  const chartData = {
    labels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th', '35th', '40th', '45th', '50th', '55th', '60th'],
    datasets: [
      {
        label: 'Sales',
        data: [20, 45, 28, 80, 99, 43, 50, 55, 72, 45, 54, 76, 65],
        fill: true,
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 3 
        }}
      >
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Active Users"
            value="40,689"
            change="8.5% Up from yesterday"
            icon={<PeopleIcon sx={{ color: '#8280FF', fontSize: '35px' }} />}
            isPositive={true}
            bg={'#8280FF8C'}
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Buyers"
            value="10293"
            change="1.3% Up from past week"
            icon={<ShoppingCartIcon sx={{ color: '#FEC53D', fontSize: '35px' }} />}
            isPositive={true}
            bg={'#FEC53D8C'}
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Sellers"
            value="2040"
            change="1.8% Up from yesterday"
            icon={<SettingsBackupRestoreIcon sx={{ color: '#FF9066', fontSize: '35px' }} />}
            isPositive={true}
            bg={'#FF90668C'}
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Sales"
            value="$89,000"
            change="4.3% Down from yesterday"
            icon={<TrendingUpOutlinedIcon sx={{ color: '#4AD991', fontSize: '35px' }} />}
            isPositive={false}
            bg={'#4AD9918C'}
          />
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          flexDirection: 'column',
          gap: 3, 
          mb: 3 
        }}
      >
      <SalesChart />
      <RevenueChart />
      </Box>
    </Box>
  );
};

export default HomePage;
