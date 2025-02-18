import { noop } from 'lodash-es'
import { Flags } from '@masknet/flags'
import { hmr } from '../../../utils-pure/index.js'
import {
    fetchInjectContentScriptList,
    contentScriptURL,
    injectedScriptURL,
    maskSDK_URL,
} from './InjectContentScripts.js'
import type { WebNavigation, Scripting } from 'webextension-polyfill'

const { signal } = hmr(import.meta.webpackHot)
if (process.env.manifest === '3') {
    if (Flags.use_register_content_script) NewImplementation(signal)
    else OldImplementation(signal)
}

function OldImplementation(signal: AbortSignal) {
    const injectContentScript = fetchInjectContentScriptList(contentScriptURL)

    async function onCommittedListener(arg: WebNavigation.OnCommittedDetailsType): Promise<void> {
        if (arg.url === 'about:blank') return
        if (!arg.url.startsWith('http')) return

        const contains = await browser.permissions.contains({ origins: [arg.url] })
        if (!contains) return

        browser.scripting.executeScript({
            files: [injectedScriptURL, maskSDK_URL],
            target: { tabId: arg.tabId, frameIds: [arg.frameId] },
            // @ts-expect-error Chrome only API
            world: 'MAIN',
        })

        browser.scripting.executeScript({
            files: await injectContentScript,
            target: { tabId: arg.tabId, frameIds: [arg.frameId] },
            world: 'ISOLATED',
        })
    }
    browser.webNavigation.onCommitted.addListener(onCommittedListener)
    signal.addEventListener('abort', () => browser.webNavigation.onCommitted.removeListener(onCommittedListener))
}

async function NewImplementation(signal: AbortSignal) {
    await unregisterExistingScripts()
    await browser.scripting.registerContentScripts([
        ...prepareMainWorldScript(['<all_urls>']),
        ...(await prepareContentScript(['<all_urls>'])),
    ])

    signal.addEventListener('abort', unregisterExistingScripts)
}
async function unregisterExistingScripts() {
    await browser.scripting
        .unregisterContentScripts({
            ids: (await browser.scripting.getRegisteredContentScripts()).map((x) => x.id),
        })
        .catch(noop)
}

function prepareMainWorldScript(matches: string[]): Scripting.RegisteredContentScript[] {
    if (Flags.has_firefox_xray_vision) return []

    const result: Scripting.RegisteredContentScript = {
        id: 'injected',
        allFrames: true,
        js: [injectedScriptURL],
        persistAcrossSessions: false,
        // @ts-expect-error Chrome API
        world: 'MAIN',
        runAt: 'document_start',
        matches,
    }
    if (Flags.mask_SDK_ready) result.js!.push(maskSDK_URL)
    return [result]
}

async function prepareContentScript(matches: string[]): Promise<Scripting.RegisteredContentScript[]> {
    const xrayScript: Scripting.RegisteredContentScript = {
        id: 'xray',
        allFrames: true,
        js: [injectedScriptURL],
        persistAcrossSessions: false,
        // @ts-expect-error Chrome API
        world: 'ISOLATED',
        runAt: 'document_start',
        matches,
    }
    if (Flags.mask_SDK_ready) xrayScript.js!.push(maskSDK_URL)

    const content: Scripting.RegisteredContentScript = {
        id: 'content',
        allFrames: true,
        js: await fetchInjectContentScriptList(contentScriptURL),
        persistAcrossSessions: false,
        // @ts-expect-error Chrome API
        world: 'ISOLATED',
        runAt: 'document_idle',
        matches,
    }
    if (Flags.has_firefox_xray_vision) return [xrayScript, content]
    return [content]
}
