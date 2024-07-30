import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from "fast-xml-parser"

export function elements(xmlFilePath) {
    const xmlFile = fs.readFileSync(xmlFilePath, 'utf-8')
    const options = {
        ignoreAttributes: false,
        ignoreDeclaration: true,
        ignorePiTags: true,
    }
    const parser = new XMLParser(options)
    const output = parser.parse(xmlFile)
    const ableton = output.Ableton.LiveSet

    function rootNoteToLetters(rootNote) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const number = rootNote

        return notes[number]
    }

    return {
        filePath: xmlFilePath,
        name: path.basename(xmlFilePath, '.xml'),
        version: output.Ableton['@_Creator'],
        scale: rootNoteToLetters(ableton.ScaleInformation.RootNote['@_Value']) + ' ' + ableton.ScaleInformation.Name['@_Value'],
        inKey: ableton.InKey['@_Value'],
        timeSelection: ableton.TimeSelection.AnchorTime['@_Value'],
        tempo: ableton.MasterTrack.DeviceChain.Mixer.Tempo.Manual['@_Value'],
        tracks: ableton.Tracks.MidiTrack.length + ableton.Tracks.AudioTrack.length,
        returnTracks: ableton.Tracks.ReturnTrack.length,
        groove: ableton.GroovePool.Grooves['@_Value'],
    }
}