import { CrossIsolationMessages, ProfileIdentifier, type SocialIdentity } from '@masknet/shared-base'
import { AnchorProvider } from '@masknet/shared-base-ui'
import { ShadowRootPopper, makeStyles } from '@masknet/theme'
import { Twitter } from '@masknet/web3-providers'
import { Fade } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSocialIdentity } from '../../../../components/DataSource/useActivatedUI.js'
import { ProfileCard } from '../../../../components/InjectedComponents/ProfileCard/index.js'
import { attachReactTreeWithoutContainer } from '../../../../utils/shadow-root.js'
import { twitterBase } from '../../base.js'
import { CARD_HEIGHT, CARD_WIDTH } from './constants.js'
import { useControlProfileCard } from './useControlProfileCard.js'
import type { TwitterBaseAPI } from '@masknet/web3-providers/types'

export function injectProfileCardHolder(signal: AbortSignal) {
    attachReactTreeWithoutContainer('profile-card', <ProfileCardHolder />, signal)
}

const useStyles = makeStyles()({
    root: {
        borderRadius: 10,
        width: CARD_WIDTH,
        maxWidth: CARD_WIDTH,
        height: CARD_HEIGHT,
        maxHeight: CARD_HEIGHT,
    },
})

function ProfileCardHolder() {
    const { classes } = useStyles()
    const holderRef = useRef<HTMLDivElement>(null)
    const [twitterId, setTwitterId] = useState('')
    const [badgeBounding, setBadgeBounding] = useState<DOMRect>()
    const { active, placement } = useControlProfileCard(holderRef)
    const [address, setAddress] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    useEffect(() => {
        return CrossIsolationMessages.events.profileCardEvent.on((event) => {
            if (!event.open) return
            setAddress(event.address ?? '')
            setTwitterId(event.userId)
            setBadgeBounding(event.anchorBounding)
            setAnchorEl(event.anchorEl)
        })
    }, [])

    const { data: identity } = useQuery({
        queryKey: ['twitter', 'profile', twitterId],
        queryFn: () => Twitter.getUserByScreenName(twitterId),
        select: useCallback((user: TwitterBaseAPI.User | null) => {
            if (!user) return null
            return {
                identifier: ProfileIdentifier.of(twitterBase.networkIdentifier, user.screenName).unwrapOr(undefined),
                nickname: user.nickname,
                avatar: user.avatarURL,
                bio: user.bio,
                homepage: user.homepage,
            } as SocialIdentity
        }, []),
    })

    const { data: resolvedIdentity } = useSocialIdentity(identity)

    return (
        <Fade in={active} easing="linear" timeout={250}>
            <ShadowRootPopper
                placeholder={undefined}
                open={!!anchorEl}
                anchorEl={anchorEl}
                keepMounted
                placement={placement}
                className={classes.root}
                ref={holderRef}
                onClick={stopPropagation}>
                <AnchorProvider anchorEl={anchorEl} anchorBounding={badgeBounding}>
                    <ProfileCard key={twitterId} identity={resolvedIdentity || undefined} currentAddress={address} />
                </AnchorProvider>
            </ShadowRootPopper>
        </Fade>
    )
}

function stopPropagation(event: React.MouseEvent) {
    event.stopPropagation()
}
