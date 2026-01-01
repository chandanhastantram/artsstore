declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

interface ModelViewerJSX {
    src: string;
    alt?: string;
    ar?: boolean;
    'ar-modes'?: string;
    'camera-controls'?: boolean;
    'auto-rotate'?: boolean;
    'shadow-intensity'?: string;
    'environment-image'?: string;
    style?: React.CSSProperties;
}

export {};
