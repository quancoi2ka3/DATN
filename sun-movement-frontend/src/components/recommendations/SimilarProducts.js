import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { trackRecommendationShown, trackRecommendationClick } from '@/services/analytics';
import Image from 'next/image';
import styles from './SimilarProducts.module.css';

const SimilarProducts = ({ productId, count = 4, title = "Sản phẩm tương tự" }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        
        if (!productId) {
          setError("Product ID is required");
          return;
        }
        
        const response = await fetch(`/api/recommendations/similar/${productId}?count=${count}`);
        if (!response.ok) throw new Error('Failed to fetch similar products');
        
        const data = await response.json();
        setSimilarProducts(data);
        
        // Track impressions
        const userId = user && user.id ? user.id : 'guest';
        data.forEach(product => {
          trackRecommendationShown(userId, product.id, 'similar', productId);
        });
        
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId, count, user]);

  const handleSimilarProductClick = (similarProductId) => {
    const userId = user && user.id ? user.id : 'guest';
    trackRecommendationClick(userId, similarProductId, 'similar');
  };

  // Don't render if there are no similar products
  if (!loading && (!similarProducts || similarProducts.length === 0)) return null;

  return (
    <div className={styles.similarProductsContainer}>
      <h2 className={styles.similarProductsTitle}>{title}</h2>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>Failed to load similar products.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {similarProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link 
                href={`/products/${product.id}`} 
                passHref
                onClick={() => handleSimilarProductClick(product.id)}
              >
                <div className={styles.productImageContainer}>
                  <Image 
                    src={product.imageUrl || '/images/placeholder-product.jpg'} 
                    alt={product.name}
                    width={250} 
                    height={250}
                    className={styles.productImage}
                  />
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                    .format(product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
