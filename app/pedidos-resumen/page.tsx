import { ConeIcon, ContainerIcon, CupIcon, IceCreamIcon } from '@/public/icons';

export default function Home() {
  return (
    <div className="order-page">
      <div className="dot-pattern" aria-hidden="true" />

      <div className="order-container">
        {/* Header */}
        <header className="order-header-wrapper">
          <div className="order-header">
            <div className="brand">
              <IceCreamIcon aria-hidden="true" style={{ color: '#141414' }} />
              <h1 className="brand-name">Your Ice Cream</h1>
            </div>
            <div className="order-badge">Order #842</div>
          </div>
        </header>

        {/* Order Items */}
        <ul className="order-list">
          {/* Cone (Large) */}
          <li className="order-item">
            <div className="item-left">
              <div className="item-icon">
                <ConeIcon aria-hidden="true" style={{ color: '#141414' }} />
              </div>
              <div className="item-details">
                <h2 className="item-name">Cone (Large)</h2>
                <p className="item-description">2 Scoops (Choco, Vanilla) + Sprinkles</p>
              </div>
            </div>
            <span className="item-price">$5.50</span>
          </li>

          {/* Cup (Medium) */}
          <li className="order-item">
            <div className="item-left">
              <div className="item-icon">
                <CupIcon aria-hidden="true" style={{ color: '#141414' }} />
              </div>
              <div className="item-details">
                <h2 className="item-name">Cup (Medium)</h2>
                <p className="item-description">1 Scoop (Strawberry)</p>
              </div>
            </div>
            <span className="item-price">$4.00</span>
          </li>

          {/* 1/4 kg */}
          <li className="order-item">
            <div className="item-left">
              <div className="item-icon">
                <ContainerIcon aria-hidden="true" style={{ color: '#141414' }} />
              </div>
              <div className="item-details">
                <h2 className="item-name">1/4 kg</h2>
                <p className="item-description">3 Flavors (Mint, Lemon, Coconut)</p>
              </div>
            </div>
            <span className="item-price">$8.50</span>
          </li>
        </ul>

        {/* Running Total Footer */}
        <div className="total-footer-wrapper">
          <div className="total-footer">
            <div className="total-label-group">
              <span className="total-label">Running Total</span>
              <span className="total-sublabel">Tax included in final calculation</span>
            </div>
            <span className="total-amount">$18.00</span>
          </div>

          {/* Page Indicator */}
          <div className="page-indicator" aria-label="Page 1 of 3">
            <div className="indicator-dot indicator-dot--active" />
            <div className="indicator-dot" />
            <div className="indicator-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
