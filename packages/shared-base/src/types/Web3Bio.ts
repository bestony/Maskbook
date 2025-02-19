import type { Web3BioPlatform } from '../NextID/types.js'

export interface Web3BioProfile {
    address: string
    identity: string
    platform: Web3BioPlatform
    displayName: string
    /** avatar url */
    avatar: string
    description: string
    email: string
    location: string | null
    /** banner url */
    header: string
    contenthash: string
    links: {
        [key in Web3BioPlatform]: {
            link: string
            handle: string
        }
    }
    social: {
        uid: string | null
        follower: number
        following: number
    }
}
