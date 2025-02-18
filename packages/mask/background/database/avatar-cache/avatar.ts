import {
    queryAvatarDB,
    isAvatarOutdatedDB,
    storeAvatarDB,
    type IdentifierWithAvatar,
    createAvatarDBAccess,
} from './db.js'
import { blobToDataURL, memoizePromise } from '@masknet/kit'
import { createTransaction } from '../utils/openDB.js'
import { memoize } from 'lodash-es'

const impl = memoizePromise(
    memoize,
    async function (identifiers: IdentifierWithAvatar[]): Promise<Map<IdentifierWithAvatar, string>> {
        const promises: Array<Promise<unknown>> = []

        const map = new Map<IdentifierWithAvatar, string>()
        const t = createTransaction(await createAvatarDBAccess(), 'readonly')('avatars')
        for (const id of identifiers) {
            // Must not await here. Because we insert non-idb async operation (blobToDataURL).
            promises.push(
                queryAvatarDB(t, id)
                    .then((buffer) => buffer && blobToDataURL(new Blob([buffer], { type: 'image/png' })))
                    .then((url) => url && map.set(id, url)),
            )
        }

        await Promise.allSettled(promises)
        return map
    },
    (id: IdentifierWithAvatar[]) => id.flatMap((x) => x.toText()).join(';'),
)
export const queryAvatarsDataURL: (identifiers: IdentifierWithAvatar[]) => Promise<Map<IdentifierWithAvatar, string>> =
    impl

/**
 * Store an avatar with a url for an identifier.
 * @param identifier - This avatar belongs to.
 * @param avatar - Avatar to store. If it is a string, will try to fetch it.
 */

export async function storeAvatar(identifier: IdentifierWithAvatar, avatar: ArrayBuffer | string): Promise<void> {
    try {
        if (typeof avatar === 'string') {
            if (avatar.startsWith('https') === false) return
            const isOutdated = await isAvatarOutdatedDB(
                createTransaction(await createAvatarDBAccess(), 'readonly')('metadata'),
                identifier,
                'lastUpdateTime',
            )
            if (isOutdated) {
                // ! must fetch before create the transaction
                const buffer = await (await fetch(avatar)).arrayBuffer()
                {
                    const t = createTransaction(await createAvatarDBAccess(), 'readwrite')('avatars', 'metadata')
                    await storeAvatarDB(t, identifier, buffer)
                }
            }
            // else do nothing
        } else {
            const t = createTransaction(await createAvatarDBAccess(), 'readwrite')('avatars', 'metadata')
            await storeAvatarDB(t, identifier, avatar)
        }
    } catch (error) {
        console.error('[AvatarDB] Store avatar failed', error)
    } finally {
        impl.cache.clear()
    }
}
