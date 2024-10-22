
export function downloadAudio(mediaId: string) {

    return dd.device.audio.download({
        mediaId
    })
}