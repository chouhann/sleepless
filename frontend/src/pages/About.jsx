import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

export const About = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      comment: 'The food was absolutely delicious! The flavors were so rich and well-balanced. Highly recommend the chef’s specials. Will order again!',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120'
    },
    {
      id: 2,
      name: 'Sophia Loren',
      rating: 5,
      comment: 'Fabulous experience. Delivery was prompt and the food arrived piping hot. The packaging was neat, and every dish was masterfully prepared.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120'
    },
    {
      id: 3,
      name: 'Marcus Aurelius',
      rating: 4,
      comment: 'Exceptional service and exquisite taste. It is hard to find authentic gourmet flavors delivered straight to your door, but Sleepless does it perfectly.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(rgba(19, 27, 46, 0.9), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200") center/cover no-repeat',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <h2 className="title-serif" style={{ fontSize: '36px', marginBottom: '8px' }}>About Us</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home / About</p>
      </div>

      {/* Brand Story Section */}
      <section className="container section-padding" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 className="title-serif gradient-text" style={{ fontSize: '32px' }}>Why Choose Us?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            At Sleepless, we believe food is not just sustenance—it is an art form. Our passion lies in crafting unforgettable culinary journeys using premium, hand-picked ingredients sourced from local organic vendors.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Our master chefs continuously experiment with tastes, balancing traditional heritage recipes with a contemporary modern twist. Every single order is prepared fresh on-demand with strict hygiene guidelines, ensuring you get the absolute best gourmet experience possible.
          </p>
        </div>

        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800" alt="Restaurant interior" />
        </div>
      </section>

      {/* Reviews Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container section-padding">
          <h3 className="title-serif gradient-text" style={{ fontSize: '36px', textAlign: 'center', marginBottom: '16px' }}>
            Client Reviews
          </h3>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '56px', fontSize: '15px' }}>
            Hear from our wonderful community of food lovers
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {reviews.map((review) => (
              <div key={review.id} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                <MessageSquareQuote size={40} style={{ color: 'rgba(245, 166, 35, 0.1)', position: 'absolute', top: '24px', right: '24px' }} />
                
                {/* Reviewer Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={review.image}
                    alt={review.name}
                    style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '16px' }}>{review.name}</h4>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? 'var(--primary)' : 'none'}
                          color={i < review.rating ? 'var(--primary)' : 'var(--text-muted)'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
