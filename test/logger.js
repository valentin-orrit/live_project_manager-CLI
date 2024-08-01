import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { log } from '../lib/logger.js'

describe('Logger', function() {
    const logDir = path.join(process.cwd(), 'logs')
    let originalLogFiles
  
    // Record existing log files
    before(function() {
      if (fs.existsSync(logDir)) {
        originalLogFiles = new Set(fs.readdirSync(logDir))
      } else {
        originalLogFiles = new Set()
      }
    })
  
    // Clean up: remove any log files created during the test
    after(function() {
      if (fs.existsSync(logDir)) {
        const currentFiles = fs.readdirSync(logDir)
        currentFiles.forEach(file => {
          if (!originalLogFiles.has(file)) {
            fs.unlinkSync(path.join(logDir, file))
          }
        })
      }
    })
  
    it('should create a log file and write a log message', function() {
      const testMessage = 'Test log message'
      log(testMessage)
  
      // Check if the logs directory exists
      expect(fs.existsSync(logDir)).to.be.true
  
      // Find the newly created log file
      const newLogFiles = fs.readdirSync(logDir).filter(file => !originalLogFiles.has(file))
      expect(newLogFiles.length).to.equal(1)
  
      // Check the content of the log file
      const logFilePath = path.join(logDir, newLogFiles[0])
      const logContent = fs.readFileSync(logFilePath, 'utf8')
      expect(logContent).to.include(testMessage)
    })
  
    it('should append multiple log messages to the same file', function() {
      const testMessages = ['First message', 'Second message', 'Third message']
      testMessages.forEach(msg => log(msg))
  
      const newLogFiles = fs.readdirSync(logDir).filter(file => !originalLogFiles.has(file))
      expect(newLogFiles.length).to.equal(1)
  
      const logFilePath = path.join(logDir, newLogFiles[0])
      const logContent = fs.readFileSync(logFilePath, 'utf8')
      testMessages.forEach(msg => {
        expect(logContent).to.include(msg)
      })
    })
  })