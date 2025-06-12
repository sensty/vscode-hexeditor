import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import _style from "./horizontalScrollContainer.css";
import { throwOnUndefinedAccessInDev, clsx } from "./util";
import * as select from "./state";

const style = throwOnUndefinedAccessInDev(_style);

const textCellWidth = 0.7;

export const HorizontalScrollContainer: React.FC<{ className?: string }> = ({
	children,
	className,
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [colOffset, setColOffset] = useRecoilState(select.columnOffset);
	const columnWidth = useRecoilValue(select.columnWidth);
	const visibleColumns = useRecoilValue(select.visibleColumns);
	const showDecodedText = useRecoilValue(select.showDecodedText);
	const dimensions = useRecoilValue(select.dimensions);

	const colPx = dimensions.rowPxHeight * (1 + (showDecodedText ? textCellWidth : 0));

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onScroll = () => {
			const newOffset = Math.floor(el.scrollLeft / colPx);
			const maxOffset = Math.max(0, columnWidth - visibleColumns);
			setColOffset(Math.max(0, Math.min(newOffset, maxOffset)));
		};
		el.addEventListener("scroll", onScroll);
		return () => el.removeEventListener("scroll", onScroll);
	}, [colPx, columnWidth, visibleColumns]);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const desired = colOffset * colPx;
		if (Math.abs(el.scrollLeft - desired) > 1) {
			el.scrollLeft = desired;
		}
	}, [colOffset, colPx]);

	const width = columnWidth * colPx;

	return (
		<div ref={ref} className={clsx(style.wrapper, className)}>
			<div className={style.inner} style={{ width }}>
				{children}
			</div>
		</div>
	);
};
