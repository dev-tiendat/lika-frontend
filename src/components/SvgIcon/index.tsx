interface SvgProps {
	name: string;
	size?: number;
	color?: string;
	prefix?: string;
	iconStyle?: { [key: string]: any };
	className?: string;
}

export default function SvgIcon(props: SvgProps) {
	const {
		name,
		size = 100,
		prefix = "icon",
		iconStyle = { width: `${size}px`, height: `${size}px` },
		color = "#000",
		className
	} = props;
	const symbolId = `#${prefix}-${name}`;
	return (
		<svg aria-hidden="true" style={iconStyle} className={className}>
			<use href={symbolId} fill={color} />
		</svg>
	);
}
