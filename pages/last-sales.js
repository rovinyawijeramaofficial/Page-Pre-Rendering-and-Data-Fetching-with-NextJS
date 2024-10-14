import { useEffect, useState } from "react";
import useSWR from "swr";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

function LastSalesPage() {
  const { data, error } = useSWR(
    'https://pre-rendering-fetching-nextjs-default-rtdb.firebaseio.com/sales.json',
    fetcher
  );

  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transformedSales);
    }
  }, [data]);

  if (error) {
    return <p>Failed to Load.</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  if (sales.length === 0) {
    return <p>No sales data available</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

export default LastSalesPage;
