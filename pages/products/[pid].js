import { Fragment } from "react";
import fs from 'fs/promises';
import path from 'path';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

// Function to load local JSON data
async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;
  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
    revalidate: 10, // Re-generate the page every 10 seconds
  };
}

export async function getStaticPaths() {
  const data = await getData(); // Use the same local data for paths

  const paths = data.products.map((product) => ({
    params: { pid: product.id.toString() },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for dynamic pages
  };
}

export default ProductDetailPage;
