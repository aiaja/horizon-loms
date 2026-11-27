import { FIGMA_ASSETS } from '../assets/figmaAssets';

export function TactileAmberButton({
  children,
  onClick,
  fullWidth = false,
  withArrow = true,
  leftIcon = null,
  noWhiteRing = false,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ua-btn-amber-outer ${fullWidth ? 'is-full' : ''} ${noWhiteRing ? 'no-white-ring' : ''} ${className}`}
      style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
    >
      <span className="ua-btn-amber-inner">
        {leftIcon && <img src={leftIcon} alt="" width={24} height={24} />}
        <span>{children}</span>
        {withArrow && <img src={FIGMA_ASSETS.arrowRightIcon} alt="" width={24} height={24} />}
      </span>
    </button>
  );
}
