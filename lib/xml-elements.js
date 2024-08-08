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
    const version = output.Ableton['@_Creator'].replace('Ableton Live ', '')

    // Transform the digits in the xml data to their respective scale notation
    function rootNoteToLetters() {
        const rootNote = ableton.ScaleInformation.RootNote['@_Value']
        const notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
        const number = rootNote

        return notes[number]
    }

    // inKey from string to boolean
    function keyToBoolean() {

        // inKey value doesnt exist before version 11 of Ableton Live
        if (parseInt(version.substr(0,2)) > 10) {
            const bool = ableton.InKey['@_Value']
    
            if (bool === 'true') {
                return true
            } else if (bool === 'false') {
                return false
            } else  {
                console.error("inKey is not a boolean")
            }
        } else {
            return false
        }
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
    // Maybe irrelevant, this is the time signature of the first midi clip 
    // I didnt find a way to get the global time signature of a project
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
        // filePath: xmlFilePath,
        name: path.basename(xmlFilePath, '.xml'),
        version: version,
        scale: rootNoteToLetters() + ' ' + ableton.ScaleInformation.Name['@_Value'],
        inKey: keyToBoolean(),
        timeSignature: timeSignature(),
        timeSelection: parseFloat(ableton.TimeSelection.AnchorTime['@_Value']),
        tempo: parseFloat(ableton.MasterTrack.DeviceChain.Mixer.Tempo.Manual['@_Value']),
        tracks: numberOfTracks(),
        returnTracks: ableton.Tracks.ReturnTrack.length,
        groove: ableton.GroovePool.Grooves['@_Value'],
    }

    return results
}

// console.log(elements(xmlFilePath))
