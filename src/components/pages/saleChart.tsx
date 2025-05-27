import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { Box, Card, Typography, Select, MenuItem } from '@mui/material';

const data = Array.from({ length: 30 }, (_, i) => ({
  name: `${(i + 1) * 2000}`,
  value: Math.floor(Math.random() * 80 + 20),
}));

const SalesChart: React.FC = () => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontSize="20px" fontWeight={600}>
          Sales Details
        </Typography>
        <Select size="small" defaultValue="October">
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="September">September</MenuItem>
        </Select>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4E96FF" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4E96FF" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickFormatter={(value) => `${Number(value) / 1000}k`} />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label) => `${label}`}
          />
          <Area type="monotone" dataKey="value" stroke="#4E96FF" fill="url(#colorLine)" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4E96FF"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
