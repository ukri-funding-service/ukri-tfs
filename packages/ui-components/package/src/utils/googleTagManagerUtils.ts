export interface GoogleTagManagerProps {
    gtmAuth: string;
    gtmPreview: string;
}

export const getGoogleTagManagerScript = (gtmAuth: string, gtmPreview: string): string =>
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${gtmAuth}&gtm_preview=${gtmPreview}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PT6WWDQ');`;
