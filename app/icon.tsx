import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <svg
                width="32"
                height="32"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="512" height="512" rx="92" fill="#09090b" />
                <path
                    d="M 335,140 C 335,72 128,252 256,256 C 384,260 178,442 178,374"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="46"
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                />
                <circle cx="335" cy="140" r="36" fill="#ffffff" />
                <circle cx="178" cy="374" r="36" fill="#ffffff" />
            </svg>
        ),
        { ...size }
    )
}
