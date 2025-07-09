import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { trackRecommendationShown, trackRecommendationClick } from '@/services/analytics';
import Image from 'next/image';
import styles from './PersonalRecommendations.module.css';

const PersonalRecommendations = ({ count = 4, title = "Đề xuất dành cho bạn" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Guest users or not logged in users don't get personalized recommendations
        if (!user || !user.id) {
          const response = await fetch(`/api/recommendations/trending?count=${count}`);
          if (!response.ok) throw new Error('Failed to fetch trending products');
          
          const data = await response.json();
          setRecommendations(data);
          
          // Track impressions for trending products
          for (const product of data) {
            await trackRecommendationShown('guest', product.id, 'trending');
          }
          
          return;
        }

        // Fetch personalized recommendations for logged in users
        const response = await fetch(`/api/recommendations/personal/${user.id}?count=${count}`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        
        const data = await response.json();
        setRecommendations(data);
        
        // Track impressions
        for (const product of data) {
          await trackRecommendationShown(user.id, product.id, 'personal');
        }
        
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, count]);

  const handleRecommendationClick = async (productId) => {
    if (user && user.id) {
      await trackRecommendationClick(user.id, productId, 'personal');
    } else {
      await trackRecommendationClick('guest', productId, 'trending');
    }
  };

  // Don't render if there are no recommendations
  if (!loading && recommendations.length === 0) return null;

  return (
    <div className={styles.recommendationsContainer}>
      <h2 className={styles.recommendationsTitle}>{title}</h2>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>Failed to load recommendations.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {recommendations.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link 
                href={`/products/${product.id}`} 
                passHref
                onClick={() => handleRecommendationClick(product.id)}
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

export default PersonalRecommendations;
