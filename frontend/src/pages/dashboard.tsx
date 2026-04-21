import React from "react";
import details from '../companiesDetails.json';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Dashboard: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
    <LineChart data={details} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="createdAt" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
  )
}