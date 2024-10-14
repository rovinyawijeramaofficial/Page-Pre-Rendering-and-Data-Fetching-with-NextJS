import { useEffect, useState } from "react";
import useSWR from "swr";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

function LastSalesPage(props) {
  const { data, error } = useSWR(
    'https://pre-rendering-fetching-nextjs-default-rtdb.firebaseio.com/sales.json',
    fetcher,
    { fallbackData: props.sales } // Use pre-fetched data from props
  );

  const [sales, setSales] = useState(props.sales || []);

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

  if (!data && !sales.length) {
    return <p>Loading...</p>;
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

export async function getStaticProps() {
    const response = await fetch(
      'https://pre-rendering-fetching-nextjs-default-rtdb.firebaseio.com/sales.json'
    );
    
    const data = await response.json();
  
    const transformedSales = [];
  
    for (const key in data) {
      transformedSales.push({
        id: key,
        username: data[key].username || 'Unknown User',  // Fallback for undefined username
        volume: data[key].volume !== undefined ? data[key].volume : null,  // Ensure volume is not undefined
      });
    }
  
    return {
      props: { sales: transformedSales },
      revalidate: 10, // Re-generate the page every 10 seconds
    };
  }
  

export default LastSalesPage;
