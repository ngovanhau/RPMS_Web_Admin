import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Room } from '@/types/types';

type RoomOccupancyChartProps = {
  allRoom: Room[];
  roomHaveCustomerList: Room[];
};

const RoomOccupancyChart: React.FC<RoomOccupancyChartProps> = ({ allRoom, roomHaveCustomerList }) => {
  const occupiedRooms = roomHaveCustomerList.length;
  const availableRooms = allRoom.length - roomHaveCustomerList.length;

  const data = [
    { name: 'Phòng đã thuê', value: occupiedRooms },
    { name: 'Phòng trống', value: availableRooms },
  ];

  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Thống kê phòng</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} phòng`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RoomOccupancyChart;