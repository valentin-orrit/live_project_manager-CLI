import * as fs from 'fs'
import { XMLParser } from "fast-xml-parser"

const xmlFilePath = process.argv[2]

export function xmlExtract(xml) {
    const xmlFile = fs.readFileSync(xml, 'utf-8')
    const options = {
        // allowBooleanAttributes: true,
        ignoreAttributes: false,
        ignoreDeclaration: true,
        ignorePiTags: true,
        // parseAttributeValue: true
    }
    const parser = new XMLParser(options)
    const output = parser.parse(xmlFile)
    const ableton = output.Ableton.LiveSet

    const elements = {
        version : output.Ableton['@_Creator'],
        scale : ableton.ScaleInformation,
        inKey : ableton.InKey,
        timeSelection : ableton.TimeSelection.AnchorTime,
        tempo : ableton.MasterTrack.DeviceChain.Mixer.Tempo.Manual,
        tracks : ableton.Tracks.MidiTrack.length + ableton.Tracks.AudioTrack.length,
        returnTracks : ableton.Tracks.ReturnTrack.length
    }
    console.log(`First Track:`, elements)
}

xmlExtract(xmlFilePath)
