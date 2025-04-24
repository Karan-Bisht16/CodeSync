import React, { useState, useEffect } from 'react';

type LazyImageProps = {
    initialSrc: string,
    finalSrc: string,
    alt: string,
    style?: string
};

export const LazyImage: React.FC<LazyImageProps> = (props) => {
    const { initialSrc, finalSrc, alt, style } = props;
    
    const [imageSrc, setImageSrc] = useState(initialSrc);

    useEffect(() => {
        const img = new Image();
        img.src = finalSrc;
        img.onload = () => setImageSrc(finalSrc);
    }, [finalSrc]);

    return <img src={imageSrc} alt={alt} className={style} />;
};