/**
 * This icon should be sync with https://mask.io/img/MB--CircleCanvas--WhiteOverBlue.svg
 */
import { SvgIcon, type SvgIconProps } from '@mui/material'

const MaskSmileFaceOutlinedSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 42 42">
        <path stroke="#fff" strokeWidth="3" d="M39.55 21a18.55 18.55 0 11-37.1 0 18.55 18.55 0 0137.1 0z" />
        <path
            fill="#fff"
            fillRule="evenodd"
            d="M32.45 16.55v6.36H12.54a8.66 8.66 0 0016.21 1.9h3.7v5.35a2.3 2.3 0 01-2.29 2.3H11.84a2.3 2.3 0 01-2.3-2.3V16.55h22.91zm-5.9 8.27a6.74 6.74 0 01-11.14 0h11.15zM16.1 18.07a3.56 3.56 0 00-3.53 3.06h1.96a1.66 1.66 0 013.14 0h1.96a3.56 3.56 0 00-3.53-3.06zm9.8 0a3.56 3.56 0 00-3.53 3.06h1.96a1.66 1.66 0 013.14 0h1.96a3.56 3.56 0 00-3.53-3.06zm4.26-8.52a2.3 2.3 0 012.3 2.29v2.8H9.54v-2.8a2.3 2.3 0 012.29-2.3h18.32z"
            clipRule="evenodd"
        />
    </svg>
)

export function MaskIconOutlined(props: SvgIconProps) {
    return <SvgIcon {...props}>{MaskSmileFaceOutlinedSVG}</SvgIcon>
}

export function MaskSharpIcon(props: SvgIconPropsWithSize) {
    const { size = 17, color } = props
    return (
        <SvgIcon style={{ width: size, height: size }} color={color} viewBox="0 0 38 38">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.8 0H34.2C36.2987 0 38 1.70132 38 3.8V34.2C38 36.2987 36.2987 38 34.2 38H3.8C1.70132 38 0 36.2987 0 34.2V3.8C0 1.70132 1.70132 0 3.8 0ZM35.0939 21.6824V12.7412H2.90569V31.8753C2.90569 33.653 4.34681 35.0941 6.12451 35.0941H31.8751C33.6528 35.0941 35.0939 33.653 35.0939 31.8753V24.3648L29.8951 24.3649C27.9129 28.3903 23.7696 31.16 18.9795 31.16C13.1854 31.16 8.3378 27.1076 7.11632 21.6825L8.2704 21.6825V21.6824H35.0939ZM18.9795 28.4984C22.2314 28.4984 25.1008 26.8606 26.8078 24.3649H11.1511C12.8581 26.8606 15.7275 28.4984 18.9795 28.4984ZM7.15874 19.1789C7.50581 16.7524 9.59263 14.8871 12.1151 14.8871C14.6376 14.8871 16.7244 16.7524 17.0715 19.1789L14.3277 19.1789C14.026 18.245 13.1494 17.5694 12.1151 17.5694C11.0808 17.5694 10.2042 18.245 9.9025 19.1789L7.15874 19.1789ZM20.9282 19.1789C21.2752 16.7524 23.362 14.8871 25.8845 14.8871C28.407 14.8871 30.4938 16.7524 30.8409 19.1789L28.0971 19.1789C27.7954 18.245 26.9189 17.5694 25.8845 17.5694C24.8502 17.5694 23.9736 18.245 23.6719 19.1789L20.9282 19.1789ZM35.0939 6.12473C35.0939 4.34702 33.6528 2.90591 31.8751 2.90591H6.12451C4.34681 2.90591 2.90569 4.34702 2.90569 6.12473V10.0588H35.0939V6.12473Z"
            />
        </SvgIcon>
    )
}

export function MaskIconInMinds(props: SvgIconPropsWithSize) {
    const { size = 18, color } = props
    return (
        <SvgIcon style={{ width: size, height: size }} color={color} viewBox="0 0 52 52">
            <svg width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 52c14.36 0 26-11.64 26-26S40.36 0 26 0 0 11.64 0 26s11.64 26 26 26Z" fill="#72727C" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41.693 19.609v8.634H14.242c1.199 5.24 5.955 9.153 11.64 9.153 4.7 0 8.765-2.675 10.71-6.562h5.1v7.252c0 1.717-1.413 3.109-3.157 3.109H13.269c-1.744 0-3.158-1.392-3.158-3.109V19.61h31.582Zm-8.13 11.225a9.33 9.33 0 0 1-7.681 3.991 9.33 9.33 0 0 1-7.681-3.991h15.362ZM19.147 21.68c-2.475 0-4.523 1.801-4.863 4.145h2.692a2.279 2.279 0 0 1 2.17-1.555c1.016 0 1.876.653 2.172 1.555h2.692c-.34-2.344-2.388-4.145-4.863-4.145Zm13.51 0c-2.475 0-4.523 1.801-4.863 4.145h2.692a2.279 2.279 0 0 1 2.17-1.555c1.016 0 1.876.653 2.172 1.555h2.692c-.34-2.344-2.388-4.145-4.863-4.145Zm5.878-11.57c1.744 0 3.158 1.392 3.158 3.108v3.8H10.11v-3.8c0-1.716 1.414-3.108 3.158-3.108h25.266Z"
                    fill="#fff"
                />
            </svg>
        </SvgIcon>
    )
}

interface SvgIconPropsWithSize extends SvgIconProps {
    size?: number
}
