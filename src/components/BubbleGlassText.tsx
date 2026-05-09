interface BubbleGlassTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

export default function BubbleGlassText({
  text,
  as: Tag = 'h1',
  className = '',
  style,
}: BubbleGlassTextProps) {
  return (
    <div className={`bubble-glass-highlight ${className}`} style={style}>
      <Tag className="bubble-glass-text" style={{ margin: 0 }}>
        {text}
      </Tag>
    </div>
  );
}
