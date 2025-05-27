import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Box, Card, Typography, Select, MenuItem } from '@mui/material';

const data = [
  { name: '5k', sales: 20, profit: 20 },
  { name: '10k', sales: 35, profit: 70 },
  { name: '15k', sales: 30, profit: 40 },
  { name: '20k', sales: 28, profit: 30 },
  { name: '25k', sales: 55, profit: 45 },
  { name: '30k', sales: 35, profit: 50 },
  { name: '35k', sales: 90, profit: 25 },
  { name: '40k', sales: 40, profit: 55 },
  { name: '45k', sales: 65, profit: 20 },
  { name: '50k', sales: 30, profit: 35 },
  { name: '55k', sales: 58, profit: 70 },
  { name: '60k', sales: 20, profit: 90 },
];

const RevenueChart: React.FC = () => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontSize="20px" fontWeight={600}>Revenue</Typography>
        <Select size="small" defaultValue="October">
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="September">September</MenuItem>
        </Select>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FB7D5B" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#FB7D5B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C59CFF" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#C59CFF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#FB7D5B"
            fill="url(#colorSales)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#C59CFF"
            fill="url(#colorProfit)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <Box display="flex" justifyContent="center" mt={2} gap={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box width={10} height={10} borderRadius="50%" bgcolor="#FB7D5B" />
          <Typography variant="body2">Sales</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box width={10} height={10} borderRadius="50%" bgcolor="#C59CFF" />
          <Typography variant="body2">Profit</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default RevenueChart;
