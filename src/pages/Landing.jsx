/**
 * Landing page — shown before authentication
 * Beautiful brand showcase with feature highlights
 */

const Icons = {
  leaf: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  flame: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  ),
  cloud: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10"/>
      <line x1="12" x2="12" y1="20" y2="4"/>
      <line x1="6" x2="6" y1="20" y2="14"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
};

export default function Landing({ onGetStarted }) {
  return (
    <div className="landing">
      {/* Hero section */}
      <header className="landing-header">
        <div className="landing-logo">
          <span style={{ color: 'var(--leaf)' }}>{Icons.leaf}</span>
          <b>Habitly</b>
        </div>
        <button className="btn btn-ghost btn-s" onClick={onGetStarted}>
          Sign in
          {Icons.arrow}
        </button>
      </header>

      {/* Hero content */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="tag" style={{ marginBottom: '16px', color: 'var(--leaf-deep)' }}>
            ✦ Small actions · Consistent progress
          </div>
          <h1 className="landing-h1">
            Build better habits.<br/>
            <em>One day at a time.</em>
          </h1>
          <p className="landing-sub">
            A calm, data-driven tracker for students and busy humans. 
            Plan your habits, keep the streak alive, and let the coach 
            turn your data into advice.
          </p>
          <div className="landing-cta">
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Get started free
              {Icons.arrow}
            </button>
          </div>
          <p className="muted" style={{ fontSize: '13px', marginTop: '12px' }}>
            No credit card required · Free forever
          </p>
        </div>

        {/* Decorative preview card */}
        <div className="landing-preview">
          <div className="card" style={{ padding: '20px', maxWidth: '380px' }}>
            <div className="row spread" style={{ marginBottom: '16px' }}>
              <div>
                <div className="tag">Today</div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  3 of 5 habits
                </div>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: 'conic-gradient(var(--leaf) 0% 60%, var(--ring-track) 60% 100%)',
                display: 'grid',
                placeItems: 'center',
              }}>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  background: 'var(--surface)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--leaf-deep)'
                }}>
                  60%
                </div>
              </div>
            </div>
            <div className="stack-xs">
              {[
                { name: 'Morning meditation', done: true, streak: 12 },
                { name: 'Read 20 pages', done: true, streak: 7 },
                { name: 'Drink 2L water', done: true, streak: 21 },
                { name: 'Exercise 30min', done: false, streak: 4 },
                { name: 'Journal', done: false, streak: 3 },
              ].map((h, i) => (
                <div key={i} className="row-s" style={{ 
                  padding: '8px', 
                  borderRadius: '8px',
                  background: h.done ? 'var(--leaf-soft)' : 'var(--surface2)',
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '7px',
                    background: h.done ? 'var(--leaf)' : 'transparent',
                    border: h.done ? 'none' : '2px solid var(--line2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                  }}>
                    {h.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                  </div>
                  <span style={{ 
                    flex: 1, 
                    fontSize: '13px', 
                    fontWeight: 600,
                    textDecoration: h.done ? 'line-through' : 'none',
                    color: h.done ? 'var(--mut)' : 'var(--ink)',
                  }}>
                    {h.name}
                  </span>
                  {h.streak > 0 && (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      color: 'var(--gold-deep)',
                      background: 'var(--gold-soft)',
                      padding: '2px 6px',
                      borderRadius: '999px',
                    }}>
                      🔥 {h.streak}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="tag" style={{ textAlign: 'center', marginBottom: '8px' }}>Features</div>
        <h2 className="h1" style={{ textAlign: 'center', marginBottom: '32px' }}>
          Everything you need to<br/>build lasting habits
        </h2>
        
        <div className="landing-features-grid">
          {[
            {
              icon: Icons.check,
              title: 'One-tap check-ins',
              desc: 'Mark habits done with a single tap. Measurable targets keep you accountable.',
              color: 'var(--leaf-soft)',
              iconColor: 'var(--leaf)',
            },
            {
              icon: Icons.flame,
              title: 'Streaks that survive',
              desc: 'Life happens. Skip a day without breaking your streak. We get it.',
              color: 'var(--gold-soft)',
              iconColor: 'var(--gold)',
            },
            {
              icon: Icons.sparkle,
              title: 'Private AI coach',
              desc: 'Get personalized insights computed from your own history. Your data stays yours.',
              color: 'var(--plum-soft)',
              iconColor: 'var(--plum)',
            },
            {
              icon: Icons.chart,
              title: 'Rich analytics',
              desc: 'Heatmaps, streaks, completion rates. See your progress at a glance.',
              color: 'var(--teal-soft)',
              iconColor: 'var(--teal)',
            },
            {
              icon: Icons.cloud,
              title: 'Cloud synced',
              desc: 'Your data follows your account. Access from any device, anywhere.',
              color: 'var(--pine-soft)',
              iconColor: 'var(--pine)',
            },
            {
              icon: Icons.leaf,
              title: 'Calm by design',
              desc: 'No clutter, no distractions. Just you and your habits. Minimal and focused.',
              color: 'var(--leaf-soft)',
              iconColor: 'var(--leaf)',
            },
          ].map((feat, i) => (
            <div key={i} className="card landing-feature-card">
              <div className="tile" style={{ background: feat.color, color: feat.iconColor }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px' }}>{feat.title}</h3>
              <p className="soft" style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '6px' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <div className="card" style={{ 
          padding: '48px 32px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-darker))',
          color: '#e9f0e5',
          border: 'none',
        }}>
          <h2 className="h1" style={{ color: '#fff', marginBottom: '12px' }}>
            Ready to start?
          </h2>
          <p style={{ color: '#b9cbbd', maxWidth: '420px', margin: '0 auto 24px', fontSize: '15px' }}>
            Join thousands building better habits. Free forever, no credit card required.
          </p>
          <button className="btn btn-lg" onClick={onGetStarted} style={{
            background: '#f0c568',
            color: 'var(--brand-darker)',
            fontWeight: 700,
          }}>
            Get started free
            {Icons.arrow}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div className="row-s">
            <span style={{ color: 'var(--leaf)' }}>{Icons.leaf}</span>
            <b style={{ fontFamily: 'var(--font-d)', fontWeight: 800 }}>Habitly</b>
          </div>
          <p className="muted" style={{ fontSize: '12px' }}>
            Small actions · Consistent progress · Better habits
          </p>
        </div>
      </footer>
    </div>
  );
}
