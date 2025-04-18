'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useEffect, useState } from 'react';

// Hook personalizado para cargar datos
function useFetchData<T>(endpoint: string, key: string): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        setData(json[key]);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, [endpoint, key]);

  return { data, loading, error };
}

// Componente PostsChart
type PostsChartProps = {
  barColors?: string[];
  margin?: { top: number; right: number; left: number; bottom: number };
};

export function PostsChart({
  barColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a0522d', '#00bcd4', '#ff69b4', '#7b68ee'],
  margin = { top: 10, right: 20, left: 0, bottom: 30 },
}: PostsChartProps) {
  const { data, loading, error } = useFetchData<{ category: string; posts: number }>('/data/chartsData.json', 'dataPosts');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height="110%">
      <BarChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="posts">
          {data.map((entry, index) => (
            <Cell key={`bar-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Componente ReportsChart
type ReportsChartProps = {
  colors?: string[];
};

export function ReportsChart({
  colors = ['#0088FE', '#00C49F', '#FFBB28'],
}: ReportsChartProps) {
  const { data, loading, error } = useFetchData<{ name: string; value: number }>('/data/chartsData.json', 'dataReports');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={65}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Componente UsersChart
type UsersChartProps = {
  lineColor?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
};

export function UsersChart({
  lineColor = '#8884d8',
  margin = { top: 20, right: 30, left: 0, bottom: 30 },
}: UsersChartProps) {
  const { data, loading, error } = useFetchData<{ month: string; users: number }>('/data/chartsData.json', 'dataUsers');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}