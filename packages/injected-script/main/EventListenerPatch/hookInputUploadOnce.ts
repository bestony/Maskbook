import type { InternalEvents } from '../../shared/index.js'
import { $, $NoXRay } from '../intrinsic.js'
import { clone_into, constructXrayUnwrappedFilesFromUintLike } from '../utils.js'
import { dispatchEventRaw } from './capture.js'

const proto = HTMLInputElement.prototype

/**
 * This API can mock a file upload in React applications when injected script has been injected into the page.
 *
 * If the <input type='file' /> element is available, you can use the API like this:
 *     input.focus()
 *     hookInputUploadOnce(format, fileName, file, true)
 *
 * If the <input type='file' /> is dynamically generated after the user clicks "Upload" button on the web page, you can use the API like this:
 *     hookInputUploadOnce(format, fileName, file, false)
 *     uploadButton.click()
 * @param format
 * @param fileName
 * @param fileArray
 * @param triggerOnActiveElementNow
 */
export function hookInputUploadOnce(
    ...[format, fileName, fileArray, triggerOnActiveElementNow]: InternalEvents['hookInputUploadOnce']
) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const e = new $NoXRay.Event('change', {
        bubbles: true,
        cancelable: true,
    })
    const file = constructXrayUnwrappedFilesFromUintLike(format, fileName, fileArray)

    const old = proto.click
    proto.click = function (this: HTMLInputElement) {
        const fileList: Partial<FileList> = clone_into({
            item: clone_into((i) => {
                if (i === 0) return file
                return null
            }),
            length: 1,
            [0]: file,
        })
        $.Reflect.defineProperty(this, 'files', {
            configurable: true,
            value: fileList,
        })
        if (timer !== null) $NoXRay.clearTimeout(timer)
        timer = $NoXRay.setTimeout(() => {
            dispatchEventRaw(this, e, {})
            proto.click = old
            $.Reflect.deleteProperty(this, 'files')
        }, 200)
    }

    if (triggerOnActiveElementNow && document.activeElement instanceof HTMLInputElement) {
        document.activeElement?.click()
    }
}
