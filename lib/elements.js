import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from "fast-xml-parser"

// const xmlFilePath = process.argv[2]

export function elements(xmlFilePath) {

    // Parser options from fast-xml-parser
    const xmlFile = fs.readFileSync(xmlFilePath, 'utf-8')
    const options = {
        ignoreAttributes: false,
        ignoreDeclaration: true,
        ignorePiTags: true,
    }
    const parser = new XMLParser(options)
    const output = parser.parse(xmlFile)
    const ableton = output.Ableton.LiveSet

    // Transform the digits in the xml data to their respective scale notation
    function rootNoteToLetters() {
        const rootNote = ableton.ScaleInformation.RootNote['@_Value']
        const notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
        const number = rootNote

        return notes[number]
    }

    // Handle errors if there is only one track in the project
    function numberOfTracks() {
        const midiTracks = ableton.Tracks.MidiTrack;
        const audioTracks = ableton.Tracks.AudioTrack;
    
        let midiTrackCount = 0;
        let audioTrackCount = 0;
    
        if (midiTracks) {
            midiTrackCount = Array.isArray(midiTracks) ? midiTracks.length : 1;
        }
    
        if (audioTracks) {
            audioTrackCount = Array.isArray(audioTracks) ? audioTracks.length : 1;
        }
    
        return midiTrackCount + audioTrackCount;
    }

    // Find the time signature of the project 
    // => possibly failing, do tests
    function timeSignature() {
        const midiTrack = Array.isArray(ableton.Tracks.MidiTrack) 
            ? ableton.Tracks.MidiTrack[0] 
            : ableton.Tracks.MidiTrack;
    
        const numerator = midiTrack?.DeviceChain?.MainSequencer?.ClipTimeable?.ArrangerAutomation?.Events?.MidiClip?.TimeSignature?.TimeSignatures?.RemoteableTimeSignature?.Numerator?.['@_Value'];
        const denominator = midiTrack?.DeviceChain?.MainSequencer?.ClipTimeable?.ArrangerAutomation?.Events?.MidiClip?.TimeSignature?.TimeSignatures?.RemoteableTimeSignature?.Denominator?.['@_Value'];
    
        if (numerator && denominator) {
            return numerator + '/' + denominator;
        }
    
        return "unknown";
    }

    // results to pass to xml-extract.js
    const results = {
        filePath: xmlFilePath,
        name: path.basename(xmlFilePath, '.xml'),
        version: output.Ableton['@_Creator'],
        scale: rootNoteToLetters() + ' ' + ableton.ScaleInformation.Name['@_Value'],
        inKey: ableton.InKey['@_Value'],
        timeSignature: timeSignature(),
        timeSelection: ableton.TimeSelection.AnchorTime['@_Value'],
        tempo: ableton.MasterTrack.DeviceChain.Mixer.Tempo.Manual['@_Value'],
        tracks: numberOfTracks(),
        returnTracks: ableton.Tracks.ReturnTrack.length,
        groove: ableton.GroovePool.Grooves['@_Value'],
    }

    return results
}

// console.log(elements(xmlFilePath))
