#!/usr/bin/env node

import { program } from "commander"
import { uncompress } from './lib/uncompress.js'
import { parse } from './lib/parse.js'
import { xmlDelete } from './lib/xml-delete.js'
import { log } from './lib/logger.js'
import chalk from 'chalk'

program
  .version("1.0.0")
  .description(".als File Processor CLI")

program
  .command('process <directory>')
  .description('Uncompress and parse .als files in the specified directory')
  .action(async (directory) => {
    try {
      console.log('Processing .als files...')
      await uncompress(directory)
      console.log(chalk.green('Uncompression Completed'))
      console.log('Parsing...')
      await parse(directory)
      console.log(chalk.green('Parsing Completed. Results saved to database.'))
      console.log(chalk.green.bold('Processing completed successfully.'))
    } catch (error) {
      log(`An error occurred: ${error}`)
      console.error(chalk.red('Processing failed:'), error.message)
    }
})

program
  .command('delete <directory>')
  .description('Delete XML files in the specified directory')
  .action(async (directory) => {
    try {
      await xmlDelete(directory)
      console.log(chalk.green.bold('XML deletion completed successfully.'))
    } catch (error) {
      console.error('XML deletion failed:', error.message)
    }
  })

program.parse(process.argv)