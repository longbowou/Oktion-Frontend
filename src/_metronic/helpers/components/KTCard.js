import clsx from 'clsx'

// Wrapper on html card:
// https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html


const KTCard = (props) => {
    const {
        className,
        shadow,
        flush,
        resetSidePaddings,
        border,
        dashed,
        stretch,
        rounded,
        utilityP,
        utilityPY,
        utilityPX,
        children,
    } = props
    return (
        <div
            className={clsx(
                'card',
                className && className,
                {
                    'shadow-sm': shadow,
                    'card-flush': flush,
                    'card-px-0': resetSidePaddings,
                    'card-bordered': border,
                    'card-dashed': dashed,
                },
                stretch && `card-${stretch}`,
                utilityP && `p-${utilityP}`,
                utilityPX && `px-${utilityPX}`,
                utilityPY && `py-${utilityPY}`,
                rounded && `card-${rounded}`
            )}
        >
            {children}
        </div>
    )
}

export {KTCard}
