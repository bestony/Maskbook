import { useAsyncRetry } from 'react-use'
import { useSubscription } from 'use-subscription'
import { NextIDProof } from '@masknet/web3-providers'
import { context } from '../context.js'
import { useSNSAdaptorContext } from '@masknet/plugin-infra/content-script'
import { NextIDPlatform } from '@masknet/shared-base'

export function usePersonaVerify() {
    const { getNextIDPlatform, queryPersonaByProfile } = useSNSAdaptorContext()
    const visitingPersonaIdentifier = useSubscription(context.lastRecognizedProfile)
    return useAsyncRetry(async () => {
        if (!visitingPersonaIdentifier?.identifier) return
        const persona = await queryPersonaByProfile(visitingPersonaIdentifier.identifier)
        if (!persona?.identifier.publicKeyAsHex) return
        const isVerified = await NextIDProof.queryIsBound(
            persona.identifier.publicKeyAsHex,
            getNextIDPlatform() ?? NextIDPlatform.Twitter,
            visitingPersonaIdentifier.identifier.userId,
        )
        return { isVerified }
    }, [getNextIDPlatform, visitingPersonaIdentifier, queryPersonaByProfile])
}
